import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    //extract the credentials
    const {
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
    //Check if the user Already exists in the db
    const existingJob = await db.job.findFirst({
      where: {
        jobTitle,
        jobCompany: { id: jobCompany }, // Correctly reference the company
        jobLocation,
        jobSalary: parseFloat(jobSalary), // Ensure jobSalary is a Float
        jobSector,
        jobDomain,
        isActive,
      },
    });

    if (existingJob) {
      return NextResponse.json(
        {
          data: null,
          message: `Job with these details already exists in the Database`,
        },
        { status: 409 }
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
    console.log(userProfile);

    const newJob = await db.job.create({
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

    return NextResponse.json(
      {
        data: newJob,
        message: "Job Created Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error); // Improved error logging
    return NextResponse.json(
      {
        error,
        message: "Server Error: Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Fetch all jobs from the candidate profile
    const jobs = await db.job.findMany({
      include: {
        jobApplicants: true, // Include candidateProfile if it's related to user
        // jobCompany: true,
      },
    });

    return new Response(JSON.stringify(jobs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch jobs", error }),
      { status: 500 }
    );
  }
}