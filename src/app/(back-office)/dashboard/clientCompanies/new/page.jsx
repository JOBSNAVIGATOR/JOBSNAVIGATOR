import FormHeader from "@/components/backOffice/FormHeader";
import ClientForm from "@/components/backOffice/forms/ClientFormTwo";
import CompanyForm from "@/components/backOffice/forms/CompanyForm";
import React from "react";

export default function page() {
  return (
    <div>
      <FormHeader title="New Company" />
      <CompanyForm />
    </div>
  );
}
