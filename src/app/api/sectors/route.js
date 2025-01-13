import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    //extract the credentials
    const { name, domains } = await request.json();
    // Validate input fields
    if (!name || !domains || domains.length === 0) {
      return NextResponse.json(
        { message: "Sector name & Domains are required." },
        { status: 400 }
      );
    }
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }
    const { user } = session;
    const { role } = user;
    if (role === "ADMIN" || role === "DEVELOPER") {
      //Check if the sector Already exists in the db with same name
      const existingSector = await db.sector.findFirst({
        where: {
          sectorName: { equals: name, mode: "insensitive" },
        },
      });
      if (existingSector) {
        return NextResponse.json(
          {
            data: null,
            message: `Sector with this Name ( ${name})  already exists in the Database`,
          },
          { status: 409 }
        );
      }

      // Check if any of the domains already exist in other sectors
      const domainCheck = await db.domain.findMany({
        where: {
          name: { in: domains }, // Check if any of the domains already exist
        },
        include: {
          sector: true, // Include the sector associated with each domain
        },
      });

      // Prepare a response for domains that are already associated with other sectors
      const existingDomains = domainCheck.filter(
        (domain) => domain.sector && domain.sector.sectorName !== name
      );

      if (existingDomains.length > 0) {
        // Create a message with domains and the sectors they belong to
        const existingDomainNames = existingDomains.map(
          (domain) => `${domain.name} (Sector: ${domain.sector.sectorName})`
        );
        return NextResponse.json(
          {
            message: `The following domains already exist in other sectors: ${existingDomainNames.join(
              ", "
            )}`,
            data: existingDomains.map((domain) => domain.name),
          },
          { status: 400 }
        );
      }

      // Create the sector with connectOrCreate for existing domains and create for new ones
      const newSector = await db.sector.create({
        data: {
          sectorName: name,
          domains: {
            connectOrCreate: domainCheck.map((domain) => ({
              where: { name: domain.name },
              create: { name: domain.name },
            })),
            create: domains
              .filter(
                (domainName) =>
                  !domainCheck.some((domain) => domain.name === domainName)
              )
              .map((domainName) => ({
                name: domainName,
              })),
          },
        },
      });

      return NextResponse.json(
        {
          data: newSector,
          message: "Sector & Domains Created Successfully",
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Role not allowed to create sectors and domains" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error creating Sector:", error);

    // Detailed error handling
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Known Prisma error (e.g., duplicate unique constraint violation)
      return NextResponse.json(
        {
          message: `Prisma error: ${error.message}`,
          details: error.meta,
        },
        { status: 500 }
      );
    } else {
      // Generic error
      return NextResponse.json(
        {
          message: "Server error: Something went wrong",
          error: error.message,
        },
        { status: 500 }
      );
    }
  }
}
