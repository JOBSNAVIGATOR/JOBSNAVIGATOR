import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  //extract the credentials
  const { tagId, candidateIds, assignedBy } = await request.json();
  if (!tagId || !candidateIds || !Array.isArray(candidateIds)) {
    return NextResponse.json(
      {
        error: "Invalid input data",
        message: "Please provide a valid tagId and an array of candidateIds.",
      },
      { status: 400 }
    );
  }
  try {
    // Check if the tag exists
    const tagExists = await db.tag.findUnique({
      where: { id: tagId },
    });
    if (!tagExists) {
      return NextResponse.json(
        {
          data: null,
          message: `Tag with ID ${tagId} doesn't exist in the database.`,
        },
        { status: 404 }
      );
    }
    // Create or update CandidateTag records for each candidate
    await Promise.all(
      candidateIds.map((candidateId) =>
        db.candidateTag.upsert({
          where: {
            candidateId_tagId: {
              candidateId,
              tagId,
            },
          },
          create: {
            candidateId,
            tagId,
            assignedBy, // Optional: Track who assigned the tag
          },
          update: {},
        })
      )
    );

    return NextResponse.json(
      {
        message: "Tag assigned to candidates successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning tag:", error);
    return NextResponse.json(
      {
        error: error.message || error,
        message: "Server Error: Something went wrong",
      },
      { status: 500 }
    );
  }
}
