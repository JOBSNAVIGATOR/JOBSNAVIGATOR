import FormHeader from "@/components/backOffice/FormHeader";
import ConsultantForm from "@/components/backOffice/forms/ConsultantForm";
import Heading from "@/components/backOffice/Heading";
import db from "@/lib/db";
import { getData } from "@/lib/getData";
import React from "react";

export default async function page({ params: { id } }) {
  // Fetch the consultant profile with the related user data
  const consultantProfile = await db.consultantProfile.findUnique({
    where: { id: id },
    include: {
      user: true, // Include the related user data
    },
  });

  if (!consultantProfile) {
    return NextResponse.json(
      { message: "Consultant profile not found" },
      { status: 404 }
    );
  }

  // Extract the user details from the consultant profile
  const specificDetails = {
    id: consultantProfile.user.id, // Get user ID from the consultantProfile
    name: consultantProfile.user.name,
    email: consultantProfile.user.email,
    contactNumber: consultantProfile.user.contactNumber,
  };

  // Check if the consultantProfile exists
  const updateData = {
    consultantProfile: consultantProfile,
  };

  return (
    <div className="flex flex-col">
      <FormHeader title="Edit Consultant" />
      <div className="max-w-4xl p-4 mx-auto"></div>
      {/* Pass specificDetails and updateData (if it exists) to Consultant */}
      <ConsultantForm user={specificDetails} updateData={updateData} />
    </div>
  );
}
