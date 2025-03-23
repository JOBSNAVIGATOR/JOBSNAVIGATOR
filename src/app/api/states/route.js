import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const states = await db.state.findMany({ include: { districts: true } }); // Fetch all sectors
    // console.log(sectors);

    return NextResponse.json(states, { status: 200 });
  } catch (error) {
    // console.error("Error fetching states:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch states", error }),
      { status: 500 }
    );
  }
}
