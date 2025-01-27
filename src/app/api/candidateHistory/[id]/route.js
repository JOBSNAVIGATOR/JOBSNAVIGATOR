import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params; // Ensure this is correct based on your setup

  try {
    const existingCandidate = await db.candidateProfile.findUnique({
      where: { id },
      include: { journeys: true },
    });
    console.log(existingCandidate.journeys);

    if (!existingCandidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(existingCandidate.journeys, { status: 200 });
  } catch (error) {
    console.error("Error fetching candidate history:", error);
    return NextResponse.json(
      { message: "Failed to Fetch Candidate History", error: error.message },
      { status: 500 }
    );
  }
}
