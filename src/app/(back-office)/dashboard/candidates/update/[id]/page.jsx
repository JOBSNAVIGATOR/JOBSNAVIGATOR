import FormHeader from "@/components/backOffice/FormHeader";
import ConsultantForm from "@/components/backOffice/forms/ConsultantForm";
import Heading from "@/components/backOffice/Heading";
import CandidateForm from "@/components/frontOffice/CandidateForm";
import db from "@/lib/db";
import { getData } from "@/lib/getData";
import React from "react";

export default async function page({ params: { id } }) {
  // Fetch the candidate profile with the related user data
  const candidateProfile = await db.candidateProfile.findUnique({
    where: { id: id },
    include: {
      user: true, // Include the related user data
    },
  });

  if (!candidateProfile) {
    return NextResponse.json(
      { message: "Candidate profile not found" },
      { status: 404 }
    );
  }

  // Extract the user details from the candidate profile
  const specificDetails = {
    id: candidateProfile.user.id, // Get user ID from the candidateProfile
    name: candidateProfile.user.name,
    email: candidateProfile.user.email,
    contactNumber: candidateProfile.user.contactNumber,
  };

  // Check if the candidateProfile exists
  const updateData = {
    candidateProfile: candidateProfile,
  };

  return (
    <div className="flex flex-col">
      <FormHeader title="Edit Consultant" />
      <div className="max-w-4xl p-4 mx-auto"></div>
      {/* Pass specificDetails and updateData (if it exists) to Candidate */}
      <CandidateForm user={specificDetails} updateData={updateData} />
    </div>
  );
}
