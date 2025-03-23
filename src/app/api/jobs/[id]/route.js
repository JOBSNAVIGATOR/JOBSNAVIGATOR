import db from "@/lib/db";
import { generateNewJobCode } from "@/lib/generateNewJobCode";
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
                sector: true,
                domain: true,
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
      jobCode,
      jobTitle,
      jobCompany,
      jobDescription,
      // jobSector,
      // jobDomain,
      jobLocation,
      jobSalary,
      jobVacancies,
      jobVacanciesRemaining,
      postedBy,
      skillsRequired,
      isActive,
      sector,
      sectorName,
      domain,
      domainName,
      state,
      state_name,
      district,
      district_name,
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

    // Skip the sector, as we will replace it // Skip the domain initials, as we will replace it // Skip the level, as we will replace it // Skip the location initials, as we will replace it
    const [
      jobSectorPart,
      jobDomainPart,
      jobLevelPart,
      jobLocationPart,
      vacanciesPart,
      datePart,
      sequencePart,
    ] = jobCode.split("-");

    const jobData = {
      sectorName,
      domainName,
      jobSalary,
      district_name,
      vacanciesInt,
    };
    const updatedCodePart = generateNewJobCode(jobData);

    // // Rebuild the jobCode using updated sector, domain, level, location,vacancies and fixed part
    const updatedJobCode = `${updatedCodePart}-${datePart}-${sequencePart}`;

    const updatedJob = await db.job.update({
      where: {
        id,
      },
      data: {
        jobTitle,
        jobCompany: {
          connect: { id: jobCompany }, // Use connect to link with the Company
        },
        sector: {
          connect: { id: sector }, // Linking candidate profile to the existing user
        },
        domain: {
          connect: { id: domain }, // Linking candidate profile to the existing user
        },
        state: {
          connect: { id: state }, // Linking candidate profile to the existing user
        },
        district: {
          connect: { id: district }, // Linking candidate profile to the existing user
        },
        jobDescription,
        // jobSector,
        // jobDomain,
        jobLocation,
        jobSalary: parseFloat(jobSalary),
        jobVacancies: vacanciesInt,
        jobCode: updatedJobCode,
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
    console.error(error);
    return NextResponse.json(
      {
        message: "Failed to Update Job",
        error,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  // console.log(id);

  try {
    // Check if event exists
    const existingJob = await db.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return NextResponse.json(
        {
          error: "Job not found",
        },
        { status: 404 }
      );
    }

    // Delete the event from the database
    await db.job.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        message: "Failed to delete event",
        error,
      },
      { status: 500 }
    );
  }
}
