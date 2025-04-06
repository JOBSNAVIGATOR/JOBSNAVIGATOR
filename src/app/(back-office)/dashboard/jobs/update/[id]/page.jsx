import FormHeader from "@/components/backOffice/FormHeader";
import JobForm from "@/components/backOffice/forms/JobForm";
import db from "@/lib/db";
import React from "react";

export default async function UpdateJob({ params: { id } }) {
  const job = await db.job.findUnique({
    where: { id: id },
    include: {
      jobCompany: true, // Include the related company data
      sector: true,
      domain: true,
      state: true,
      district: true,
      clientSpoc: {
        include: {
          user: true, // Include user in candidateProfile
        },
      },
    },
  });

  if (!job) {
    return NextResponse.json({ message: "Job not found" }, { status: 404 });
  }
  return (
    <div>
      <FormHeader title="Update Job" />
      <JobForm updateData={job} />
    </div>
  );
}
