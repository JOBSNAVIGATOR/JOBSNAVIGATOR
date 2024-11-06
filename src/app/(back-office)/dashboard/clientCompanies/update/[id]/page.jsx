import FormHeader from "@/components/backOffice/FormHeader";
import CompanyForm from "@/components/backOffice/forms/CompanyForm";
import JobForm from "@/components/backOffice/forms/JobForm";
import db from "@/lib/db";
import React from "react";

export default async function UpdateCompany({ params: { id } }) {
  const company = await db.company.findUnique({
    where: { id },
  });

  if (!company) {
    return NextResponse.json({ message: "Company not found" }, { status: 404 });
  }
  return (
    <div>
      <FormHeader title="Update Company" />
      <CompanyForm updateData={company} />
    </div>
  );
}
