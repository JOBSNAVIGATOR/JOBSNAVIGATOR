import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      consultant,
      finalSectors,
      finalDomains,
      finalStates,
      finalDistricts,
      assignedLevel,
    } = await request.json();
    // console.log("backendddddd", consultant, finalSectors, finalDomains);

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

    // Check if both finalSectors and finalDomains have length greater than 0
    if (finalSectors.length === 0 || finalDomains.length === 0) {
      return NextResponse.json(
        {
          message:
            "Both sectors and domains should have at least one assignment.",
        },
        { status: 400 }
      );
    }
    // Check if both finalStates and finalDistricts have length greater than 0
    if (finalStates.length === 0 || finalDistricts.length === 0) {
      return NextResponse.json(
        {
          message:
            "Both states and districts should have at least one assignment.",
        },
        { status: 400 }
      );
    }

    /*** 1️⃣ Delete Existing Assignments ***/
    await db.consultantAssignedSectors.deleteMany({
      where: { consultantId: consultant },
    });

    await db.consultantAssignedDomains.deleteMany({
      where: { consultantId: consultant },
    });
    await db.ConsultantAssignedStates.deleteMany({
      where: { consultantId: consultant },
    });
    await db.ConsultantAssignedDistricts.deleteMany({
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

    /*** 4 Insert New State Assignments ***/
    if (finalStates.length > 0) {
      await db.ConsultantAssignedStates.createMany({
        data: finalStates.map((stateId) => ({
          consultantId: consultant,
          stateId,
        })),
      });
    }
    /*** 3️⃣ Insert New District Assignments ***/
    if (finalDistricts.length > 0) {
      await db.ConsultantAssignedDistricts.createMany({
        data: finalDistricts.map((districtId) => ({
          consultantId: consultant,
          districtId,
        })),
      });
    }

    /*** 6️⃣ Update Consultant Profile's assignedLevel ***/
    await db.consultantProfile.update({
      where: { id: consultant },
      data: { assignedLevel }, // Update only assignedLevel
    });

    return NextResponse.json(
      { message: "Sectors, Domains, Location Assigned Successfully" },
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
