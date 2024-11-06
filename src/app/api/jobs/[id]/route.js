import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  // console.log("check", id);
  try {
    // console.log("check4");
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

export async function PUT(request) {
  try {
    const {
      id,
      jobTitle,
      jobCompany,
      jobDescription,
      jobSector,
      jobDomain,
      jobLocation,
      jobSalary,
      jobVacancies,
      jobVacanciesRemaining,
      postedBy,
      skillsRequired,
      isActive,
    } = await request.json();

    const job = await db.job.findUnique({
      where: {
        id,
      },
    });
    if (!job) {
      return NextResponse.json(
        {
          data: null,
          message: "No Job Found, Please Create One",
        },
        { status: 404 }
      );
    }
    // Convert jobVacancies and jobVacanciesRemaining to integers
    const vacanciesInt = parseInt(jobVacancies, 10);
    const vacanciesRemainingInt = parseInt(jobVacanciesRemaining, 10);

    // Fetch the User Profile using the User ID
    const userProfile = await db.user.findUnique({
      where: { id: postedBy },
      include: { consultantProfile: true }, // Use the User ID here
    });
    // console.log(userProfile);

    const updatedJob = await db.job.update({
      where: {
        id,
      },
      data: {
        jobTitle,
        jobCompany: {
          connect: { id: jobCompany }, // Use connect to link with the Company
        },
        jobDescription,
        jobSector,
        jobDomain,
        jobLocation,
        jobSalary: parseFloat(jobSalary),
        jobVacancies: vacanciesInt,
        jobVacanciesRemaining: vacanciesRemainingInt,
        postedBy: {
          connect: { id: userProfile.consultantProfile.id }, // Use connect to link with the Company
        },
        skillsRequired,
        isActive,
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Update Job",
        error,
      },
      { status: 500 }
    );
  }
}
