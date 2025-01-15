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
    const { id, name, domains: updatedDomains } = await request.json();

    // Step 1: Fetch the existing sector and its domains
    const existingSector = await db.sector.findUnique({
      where: { id },
      include: { domains: true },
    });

    if (!existingSector) {
      return NextResponse.json(
        { data: null, message: "No Sector Found, Please Create One" },
        { status: 404 }
      );
    }

    // Step 2: Extract existing domain names for comparison
    const existingDomainNames = existingSector.domains.map(
      (domain) => domain.name
    );

    // Step 3: Identify domains to delete
    const domainsToDelete = existingDomainNames.filter(
      (domainName) => !updatedDomains.includes(domainName)
    );

    // Step 4: Delete domains that are no longer associated with this sector
    if (domainsToDelete.length > 0) {
      await db.domain.deleteMany({
        where: {
          name: { in: domainsToDelete },
          sectorId: id,
        },
      });
    }

    // Step 5: Identify domains to add
    const domainsToAdd = updatedDomains.filter(
      (domainName) => !existingDomainNames.includes(domainName)
    );

    // Step 6: Check for conflicting domains in other sectors
    const conflictingDomains = await db.domain.findMany({
      where: {
        name: { in: domainsToAdd },
        sectorId: { not: id }, // Ensure domain is not in the current sector
      },
      include: { sector: true },
    });

    if (conflictingDomains.length > 0) {
      const conflictDetails = conflictingDomains.map(
        (domain) => `${domain.name} (Sector: ${domain.sector.sectorName})`
      );
      return NextResponse.json(
        {
          message: `The following domains already exist in other sectors: ${conflictDetails.join(
            ", "
          )}`,
          data: conflictingDomains.map((domain) => domain.name),
        },
        { status: 400 }
      );
    }

    // Step 7: Add new non-conflicting domains to the sector
    const updatedSector = await db.sector.update({
      where: { id },
      data: {
        sectorName: name,
        domains: {
          connectOrCreate: domainsToAdd.map((domainName) => ({
            where: { name: domainName },
            create: { name: domainName },
          })),
        },
      },
    });

    return NextResponse.json(
      {
        data: updatedSector,
        message: "Sector updated successfully with domain changes",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update sector", error },
      { status: 500 }
    );
  }
}
