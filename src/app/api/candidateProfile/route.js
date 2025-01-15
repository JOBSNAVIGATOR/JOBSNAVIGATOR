import db from "@/lib/db";
import { generateNewCandidateCode } from "@/lib/generateNewCandidateCode";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const {
      id,
      emergencyContactNumber,
      gender,
      sector,
      sectorName,
      domain,
      domainName,
      designation,
      currentCompany,
      previousCompanyName,
      currentJobLocation,
      totalWorkingExperience,
      currentCtc,
      degree,
      collegeName,
      graduationYear,
      skills,
      resume, // Assuming the resume is base64 encoded'
      candidateCode,
    } = await request.json();

    const candidateProfile = await db.candidateProfile.findUnique({
      where: {
        id,
      },
    });
    if (!candidateProfile) {
      return NextResponse.json(
        {
          data: null,
          message: "No Candidate Profile Found, Please Create One",
        },
        { status: 404 }
      );
    }
    // Skip the sector, as we will replace it // Skip the domain initials, as we will replace it // Skip the level, as we will replace it // Skip the location initials, as we will replace it
    const [prefix, existingDate, existingInitials, sequence] =
      candidateCode.split("-");
    // console.log(prefix, existingDate, existingInitials, sequence);

    const candidateData = {
      sectorName,
      domainName,
      currentCtc,
      currentJobLocation,
    };
    const updatedCodePart = generateNewCandidateCode(candidateData);

    // Rebuild the candidateCode using existing parts + updated sector, domain, level, location
    const updatedCandidateCode = `${prefix}-${existingDate}-${existingInitials}-${sequence}-${updatedCodePart}`;

    const updatedCandidateProfile = await db.candidateProfile.update({
      where: {
        id,
      },
      data: {
        emergencyContactNumber,
        gender,
        // sector,
        // domain,
        designation,
        currentCompany,
        previousCompanyName,
        currentJobLocation,
        totalWorkingExperience,
        currentCtc,
        degree,
        collegeName,
        graduationYear,
        skills,
        resume,
        candidateCode: updatedCandidateCode, // Update only sector/domain/level/location part
        sector: {
          connect: { id: sector }, // Linking candidate profile to the existing user
        },
        domain: {
          connect: { id: domain }, // Linking candidate profile to the existing user
        },
      },
    });

    return NextResponse.json(updatedCandidateProfile);
  } catch (error) {
    console.error("Error updating candidate profile: ", error);
    return NextResponse.json(
      {
        message: "Failed to Update User",
        error,
      },
      { status: 500 }
    );
  }
}
