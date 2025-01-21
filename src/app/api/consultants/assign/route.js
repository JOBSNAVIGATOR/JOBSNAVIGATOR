import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { consultant, finalSectors, finalDomains } = await request.json();
    console.log("backendddddd", consultant, finalSectors, finalDomains);

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

    /*** 1️⃣ Delete Existing Assignments ***/
    await db.consultantAssignedSectors.deleteMany({
      where: { consultantId: consultant },
    });

    await db.consultantAssignedDomains.deleteMany({
      where: { consultantId: consultant },
    });

    /*** 2️⃣ Insert New Sector Assignments ***/
    if (finalSectors.length > 0) {
      await db.consultantAssignedSectors.createMany({
        data: finalSectors.map((sectorId) => ({
          consultantId: consultant,
          sectorId,
        })),
      });
    }

    /*** 3️⃣ Insert New Domain Assignments ***/
    if (finalDomains.length > 0) {
      await db.consultantAssignedDomains.createMany({
        data: finalDomains.map((domainId) => ({
          consultantId: consultant,
          domainId,
        })),
      });
    }

    return NextResponse.json(
      { message: "Sectors and Domains Assigned Successfully" },
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
