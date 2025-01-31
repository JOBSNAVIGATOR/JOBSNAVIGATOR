import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { jobApplicantId, candidateId, jobId, status, remarks } =
      await request.json();
    // console.log("backend", id, status);
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          data: null,
          message: "Unauthorized access",
        },
        { status: 401 }
      );
    }
    const consultantId = session?.user?.id;
    const consultantName = session?.user?.name;

    const jobApplicantData = await db.jobApplicant.findUnique({
      where: {
        id: jobApplicantId,
      },
    });
    const jobData = await db.job.findUnique({
      where: {
        id: jobId,
      },
    });
    if (!jobApplicantData) {
      return NextResponse.json(
        {
          data: null,
          message: "No Applicant Profile Found, Please Create One",
        },
        { status: 404 }
      );
    }

    const updatedJobApplicantData = await db.jobApplicant.update({
      where: {
        id: jobApplicantId,
      },
      data: {
        status,
      },
    });

    // Combine request remarks with backend-generated remarks
    const combinedRemarks = `${
      remarks ? remarks + " | " : ""
    }Status Updated to: ${status} for job: ${jobData.jobTitle} (Job Code: ${
      jobData.jobCode
    }) by: ${consultantName}`;

    // Create an entry in CandidateJourney (History)
    const newCandidateJourney = await db.candidateJourney.create({
      data: {
        candidateId, // Linking the journey to the new candidate profile
        consultantId,
        jobId,
        status,
        eventType: "STATUS_CHANGED", // Event type: Profile Created
        remarks: combinedRemarks,
        createdAt: new Date(), // Current timestamp
      },
    });
    return NextResponse.json(updatedJobApplicantData);
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Update Status",
        error,
      },
      { status: 500 }
    );
  }
}
