import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request) {
  try {
    // Get `ref_state_id` from query parameters
    const { searchParams } = new URL(request.url);
    const ref_sector_id = searchParams.get("ref_sector_id");

    if (!ref_sector_id) {
      return NextResponse.json(
        { error: "ref_sector_id is required" },
        { status: 400 }
      );
    }

    // Fetch domains that match `ref_sector_id`
    const domains = await db.domain.findMany({
      where: { sectorId: ref_sector_id },
      select: {
        id: true,
        name: true,
      },
    });

    const formattedDomains = domains.map((domain) => ({
      value: domain.id.toString(), // Convert BigInt to string
      label: domain.name,
    }));

    return NextResponse.json(formattedDomains, { status: 200 });
  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json(
      { error: "Failed to fetch Domains" },
      { status: 500 }
    );
  }
}
