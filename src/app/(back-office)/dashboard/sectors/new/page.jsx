import FormHeader from "@/components/backOffice/FormHeader";
import SectorForm from "@/components/backOffice/forms/SectorForm";
import React from "react";

export default function page() {
  return (
    <div>
      <FormHeader title="New Sector" />
      <SectorForm />
    </div>
  );
}
