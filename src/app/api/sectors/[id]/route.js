import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params;
  // console.log("delete id is selected", id);

  try {
    // Check if sector exists
    // console.log("1");

    const existingSector = await db.sector.findUnique({
      where: { id },
    });
    // console.log("2");

    if (!existingSector) {
      return NextResponse.json(
        {
          error: "Sector not found",
        },
        { status: 404 }
      );
    }

    // Delete the sector from the database
    await db.sector.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Sector deleted successfully",
    });
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        message: "Failed to delete Sector",
        error,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, name, domains } = await request.json();

    const existingSector = await db.sector.findUnique({
      where: {
        id,
      },
    });
    if (!existingSector) {
      return NextResponse.json(
        {
          data: null,
          message: "No Sector Found, Please Create One",
        },
        { status: 404 }
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
    // console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Update Sector",
        error,
      },
      { status: 500 }
    );
  }
}
