import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";
import { generateJobCode } from "@/lib/generateJobCode";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    //extract the credentials
    const {
      jobTitle,
      jobCompany,
      jobDescription,
      jobLocation,
      clientId,
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
    } = await request.json();
    //Check if the user Already exists in the db
    const existingJob = await db.job.findFirst({
      where: {
        jobTitle,
        jobCompany: { id: jobCompany }, // Correctly reference the company
        clientSpoc: { id: clientId },
        sector: { id: sector },
        domain: { id: domain },
        jobLocation,
        jobSalary: parseFloat(jobSalary), // Ensure jobSalary is a Float
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

    const sequenceNumber = (await db.job.count()) + 1;
    // console.log("chck2", sequenceNumber);

    const jobData = {
      sectorName,
      domainName,
      jobSalary,
      jobLocation,
      vacanciesInt,
    };

    // console.log("cehck5", jobData);

    const jobCodeCreated = generateJobCode(jobData, sequenceNumber);

    // Fetch the User Profile using the User ID
    const userProfile = await db.user.findUnique({
      where: { id: postedBy },
      include: { consultantProfile: true }, // Use the User ID here
    });
    // console.log(userProfile);

    const newJob = await db.job.create({
      data: {
        jobTitle,
        jobCompany: {
          connect: { id: jobCompany }, // Use connect to link with the Company
        },
        clientSpoc: {
          connect: { id: clientId },
        },
        sector: {
          connect: { id: sector }, // Linking candidate profile to the existing user
        },
        domain: {
          connect: { id: domain }, // Linking candidate profile to the existing user
        },
        jobDescription,
        jobLocation,
        jobSalary: parseFloat(jobSalary),
        jobCode: jobCodeCreated,
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
    // Fetch session data
    const session = await getServerSession(authOptions);

    // If no session or if the user is a candidate, show all jobs
    let jobs;
    if (!session || session.user.role === "CANDIDATE") {
      jobs = await db.job.findMany({
        where: { isActive: true }, // Active jobs for everyone (whether logged in or a candidate)
        include: {
          jobApplicants: true,
          jobCompany: true,
          clientSpoc: { include: { user: true } },
          sector: true,
          domain: true,
        },
      });
    } else {
      const { user } = session;
      const { role, id: userId } = user;

      // Fetch user data and consultantProfile (if available)
      const userData = await db.user.findUnique({
        where: { id: userId },
        // include: { consultantProfile: true },
        include: {
          consultantProfile: {
            include: {
              role: true,
            },
          },
        },
      });

      // Handle case if no user data is found
      if (!userData) {
        return NextResponse.json(
          { message: "User data not found" },
          { status: 404 }
        );
      }

      const consultantId = userData?.consultantProfile?.id;
      const userRole = userData?.consultantProfile?.role?.name;

      // Query jobs based on role
      if (role === "ADMIN") {
        jobs = await db.job.findMany({
          include: {
            jobApplicants: true,
            jobCompany: true,
            clientSpoc: { include: { user: true } },
            sector: true,
            domain: true,
          },
        });
      } else if (role === "CONSULTANT" && userRole === "Admin Consultant") {
        jobs = await db.job.findMany({
          // where: { consultantId }, // Filter jobs based on consultant ID
          include: {
            jobApplicants: true,
            jobCompany: true,
            clientSpoc: { include: { user: true } },
            sector: true,
            domain: true,
          },
        });
      } else if (role === "CONSULTANT" && userRole === "Team Leader") {
        jobs = await db.job.findMany({
          where: {
            OR: [
              { consultantId }, // Jobs posted by this consultant
              {
                assignedConsultants: {
                  some: { consultantId }, // Jobs assigned to this consultant
                },
              },
            ],
          },
          include: {
            jobApplicants: true,
            jobCompany: true,
            clientSpoc: { include: { user: true } },
            sector: true,
            domain: true,
          },
        });
      } else if (role === "CONSULTANT" && userRole === "Consultant") {
        jobs = await db.job.findMany({
          where: {
            assignedConsultants: {
              some: { consultantId }, // Only fetch assigned jobs
            },
          }, // Filter jobs based on consultant ID
          include: {
            jobApplicants: true,
            jobCompany: true,
            clientSpoc: { include: { user: true } },
            sector: true,
            domain: true,
          },
        });
      } else {
        return NextResponse.json(
          { message: "Role not allowed to fetch jobs" },
          { status: 403 }
        );
      }
    }
    console.log("jobs", jobs);

    // Return the fetched jobs
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { message: "Failed to fetch jobs", error: error.message },
      { status: 500 }
    );
  }
}
