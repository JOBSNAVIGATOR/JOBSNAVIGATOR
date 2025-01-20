import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Extract the credentials
    const { consultant, sector, domains } = await request.json();

    // Check if the consultant exists
    const existingConsultant = await db.consultantProfile.findUnique({
      where: { id: consultant },
    });

    if (!existingConsultant) {
      return NextResponse.json(
        { data: null, message: "Consultant Not Found" },
        { status: 404 }
      );
    }

    // Check if the consultant is already assigned to this sector
    const existingAssignedSector = await db.consultantAssignedSectors.findFirst(
      {
        where: {
          consultantId: consultant,
          sectorId: sector,
        },
      }
    );

    // Assign sector only if not already assigned
    let consultantAssignedSector = null;
    if (!existingAssignedSector) {
      consultantAssignedSector = await db.consultantAssignedSectors.create({
        data: {
          consultant: { connect: { id: consultant } },
          sector: { connect: { id: sector } },
        },
      });
    }

    // Check if the consultant is already assigned to any of the provided domains
    const existingAssignedDomains = await db.consultantAssignedDomains.findMany(
      {
        where: {
          consultantId: consultant,
          domainId: { in: domains },
        },
        include: { domain: true },
      }
    );

    if (existingAssignedDomains.length > 0) {
      return NextResponse.json(
        {
          data: null,
          message: `Consultant has already been assigned these domains: ${existingAssignedDomains
            .map((d) => d.domain.name)
            .join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Assign the consultant to multiple domains
    const consultantAssignedDomains = await Promise.all(
      domains.map((domainId) =>
        db.consultantAssignedDomains.create({
          data: {
            consultant: { connect: { id: consultant } },
            domain: { connect: { id: domainId } },
          },
        })
      )
    );

    return NextResponse.json(
      {
        data: {
          ...(consultantAssignedSector && { consultantAssignedSector }), // Only include if created
          consultantAssignedDomains,
        },
        message: "Sectors and Domains Assigned Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error assigning sectors/domains:", error);
    return NextResponse.json(
      { error: error.message, message: "Server Error: Something went wrong" },
      { status: 500 }
    );
  }
}
