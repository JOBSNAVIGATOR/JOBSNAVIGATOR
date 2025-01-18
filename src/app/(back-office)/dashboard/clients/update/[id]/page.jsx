import FormHeader from "@/components/backOffice/FormHeader";
import ClientFormTwo from "@/components/backOffice/forms/ClientFormTwo";
import db from "@/lib/db";
import React from "react";

export default async function page({ params: { id } }) {
  // Fetch the candidate profile with the related user data
  const clientProfile = await db.clientProfile.findUnique({
    where: { id: id },
    include: {
      user: true, // Include the related user data
      sector: true,
      domain: true,
    },
  });

  if (!clientProfile) {
    return NextResponse.json(
      { message: "Client profile not found" },
      { status: 404 }
    );
  }

  // Extract the user details from the candidate profile
  const specificDetails = {
    id: clientProfile.user.id, // Get user ID from the candidateProfile
    name: clientProfile.user.name,
    email: clientProfile.user.email,
    contactNumber: clientProfile.user.contactNumber,
  };

  // Check if the candidateProfile exists
  const updateData = {
    clientProfile: clientProfile,
  };

  return (
    <div className="flex flex-col">
      <FormHeader title="Edit Client" />
      <div className="max-w-4xl p-4 mx-auto"></div>
      {/* Pass specificDetails and updateData (if it exists) to Client */}
      <ClientFormTwo user={specificDetails} updateData={updateData} />
    </div>
  );
}
