import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  // console.log("check", id);
  try {
    console.log("check4");
    const job = await db.job.findUnique({
      where: {
        id,
      },
      // include: {
      //   jobApplicants: true, // Include candidateProfile if it's related to user
      //   jobCompany: true,
      // },
      include: {
        jobApplicants: {
          include: {
            candidateProfile: {
              include: {
                user: true, // Include user in candidateProfile
              },
            },
          },
        },
        jobCompany: true,
      },
    });
    // console.log("check5", job);
    return NextResponse.json(job);
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Job",
        error,
      },
      { status: 500 }
    );
  }
}
