import CandidateForm from "@/components/frontOffice/CandidateForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function page({ params: { id } }) {
  const user = await getData(`users/${id}`);

  const specificDetails = {
    id: user?.id,
    name: user?.name,
    email: user?.email,
    contactNumber: user?.contactNumber,
  };
  // console.log(specificDetails);

  // Check if candidateProfile exists
  const updateData = user?.candidateProfile
    ? {
        candidateProfile: {
          ...user.candidateProfile,
          include: {
            sector: true,
            domain: true,
          },
        },
      }
    : {};

  return (
    <div className="flex flex-col gap-6 p-16">
      <div className="max-w-4xl p-4 mx-auto">
        <h2 className="text-4xl">
          Hello {user?.name} Tell us More About Yourself
        </h2>
      </div>
      {/* Pass specificDetails and updateData (if it exists) to CandidateForm */}
      <CandidateForm user={specificDetails} updateData={updateData} />
    </div>
  );
}
