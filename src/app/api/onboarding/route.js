import db from "@/lib/db";
import { generateCandidateCode } from "@/lib/generateCandidateCode";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    //extract the credentials
    const {
      id,
      email,
      gender,
      emergencyContactNumber,
      sector,
      domain,
      currentCtc,
      designation,
      currentCompany,
      currentJobLocation,
      totalWorkingExperience,
      degree,
      collegeName,
      graduationYear,
      previousCompanyName,
      resume, // URL or file path to the resume
      skills,
    } = await request.json();
    //Check if the user Already exists in the db
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: `User with this email ( ${email})  Don't exists in the Database`,
        },
        { status: 409 }
      );
    }
    const sequenceNumber = (await db.candidateProfile.count()) + 1;
    const candidateData = {
      id,
      name: existingUser.name,
      currentCtc,
      sector,
      domain,
      currentJobLocation,
    };

    const candidateCode = generateCandidateCode(candidateData, sequenceNumber);

    const newCandidateProfile = await db.candidateProfile.create({
      data: {
        gender,
        emergencyContactNumber,
        sector,
        domain,
        currentCtc,
        designation,
        currentCompany,
        currentJobLocation,
        totalWorkingExperience,
        degree,
        collegeName,
        graduationYear,
        previousCompanyName,
        resume, // URL or file path to the resume
        skills,
        candidateCode, // Storing the generated candidate code
        user: {
          connect: { id: existingUser.id }, // Linking candidate profile to the existing user
        },
      },
    });
    console.log(newCandidateProfile);

    return NextResponse.json(
      {
        data: newCandidateProfile,
        message: "Profile Updated Successfully",
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
