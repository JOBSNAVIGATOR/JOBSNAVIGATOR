import FormHeader from "@/components/backOffice/FormHeader";
import CandidateFormTwo from "@/components/backOffice/forms/CandidateFormTwo";
import React from "react";

export default function page() {
  return (
    <div>
      <FormHeader title="New Candidate" />
      <CandidateFormTwo />
    </div>
  );
}
