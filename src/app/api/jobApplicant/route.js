import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    //extract the credentials
    const { userId, jobId } = await request.json();
    console.log(userId, jobId);

    // Check if the candidate and job exist
    const userData = await db.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true },
    });
    console.log(userData?.candidateProfile?.id);
    const candidateId = userData?.candidateProfile?.id;

    const job = await db.job.findUnique({
      where: { id: jobId },
    });
    if (!userData || !job) {
      return NextResponse.json(
        {
          data: null,
          message: `Candidate or Job not found`,
        },
        { status: 404 }
      );
    }
    // Check if the candidate has already applied for the job
    const existingApplication = await db.jobApplicant.findFirst({
      where: {
        candidateId: candidateId,
        jobId: jobId,
      },
    });
    if (existingApplication) {
      return NextResponse.json(
        {
          data: null,
          message: `Candidate has already applied for this job`,
        },
        { status: 400 }
      );
    }

    // Create a new job applicant
    const jobApplicant = await db.jobApplicant.create({
      data: {
        candidateProfile: { connect: { id: candidateId } },
        job: { connect: { id: jobId } },
        status: "Applied",
      },
    });

    return NextResponse.json(
      {
        data: jobApplicant,
        message: "jobApplicant Created Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Server Error: Something went wrong",
      },
      { status: 500 }
    );
  }
}
