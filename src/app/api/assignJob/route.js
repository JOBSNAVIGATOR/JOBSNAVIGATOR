import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  //extract the credentials
  const { jobId, candidateIds, assignedById, assignedByName } =
    await request.json();
  if (!jobId || !candidateIds || !Array.isArray(candidateIds)) {
    return NextResponse.json(
      {
        error: "Invalid input data",
        message: "Please provide a valid jobId and an array of candidateIds.",
      },
      { status: 400 }
    );
  }
  try {
    // Check if the job exists
    const jobExists = await db.job.findUnique({
      where: { id: jobId },
    });
    if (!jobExists) {
      return NextResponse.json(
        {
          data: null,
          message: `Job with ID ${jobId} doesn't exist in the database.`,
        },
        { status: 404 }
      );
    }

    // Check if the candidate and job exist
    const userData = await db.user.findUnique({
      where: { id: assignedById },
      include: { consultantProfile: true },
    });
    // console.log(userData?.candidateProfile?.id);
    const consultantId = userData?.consultantProfile?.id;

    // Create or update CandidateTag records for each candidate
    await Promise.all(
      candidateIds.map((candidateId) =>
        db.jobApplicant.upsert({
          where: {
            candidateId_jobId: {
              candidateId,
              jobId,
            },
          },
          create: {
            candidateProfile: { connect: { id: candidateId } },
            job: { connect: { id: jobId } },
            assignedByName, // Optional: Track who assigned the tag
            consultantProfile: { connect: { id: consultantId } },
            status: "Applied",
            // candidateId,
            // jobId,
            // assignedByName, // Optional: Track who assigned the tag
            // assignedById: consultantId, // Optional: Track who assigned the tag
            // status: "Applied",
          },
          update: {},
        })
      )
    );

    return NextResponse.json(
      {
        message: "Job assigned to candidates successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning job:", error);
    return NextResponse.json(
      {
        error: error.message || error,
        message: "Server Error: Something went wrong",
      },
      { status: 500 }
    );
  }
}
