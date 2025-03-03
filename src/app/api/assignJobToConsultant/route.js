import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  //extract the credentials
  const { jobs: jobIds, id: consultantId } = await request.json();
  if (
    !jobIds ||
    !consultantId ||
    !Array.isArray(jobIds) ||
    jobIds.length === 0
  ) {
    return NextResponse.json(
      {
        error: "Invalid input data",
        message:
          "Provide a valid consultantId and a non-empty array of jobIds.",
      },
      { status: 400 }
    );
  }
  try {
    // Check if the consultant exists
    const consultantExists = await db.consultantProfile.findUnique({
      where: { id: consultantId },
    });
    if (!consultantExists) {
      return NextResponse.json(
        {
          message: `Consultant with ID ${consultantId} doesn't exist in the database.`,
        },
        { status: 404 }
      );
    }
    // **Step 1: Delete existing job assignments for this consultant**
    await db.jobAssignment.deleteMany({
      where: { consultantId },
    });

    // **Step 2: Fetch valid job IDs**
    const existingJobs = await db.job.findMany({
      where: { id: { in: jobIds } },
      select: { id: true },
    });
    const validJobIds = existingJobs.map((job) => job.id);

    if (validJobIds.length === 0) {
      return NextResponse.json(
        {
          error: "No valid jobs found",
          message: "None of the provided job IDs exist in the database.",
        },
        { status: 400 }
      );
    }

    // **Step 3: Assign new jobs to the consultant**
    const assignedJobs = await Promise.all(
      validJobIds.map(async (jobId) => {
        return db.jobAssignment.create({
          data: {
            consultant: { connect: { id: consultantId } },
            job: { connect: { id: jobId } },
          },
        });
      })
    );

    return NextResponse.json(
      {
        message: "Job assigned to consultant successfully.",
        assignedJobs, // Return assigned jobs for reference
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
