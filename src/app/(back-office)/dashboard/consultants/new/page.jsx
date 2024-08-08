import ConsultantForm from "@/components/backOffice/forms/ConsultantForm";
import Heading from "@/components/backOffice/Heading";
import React from "react";

export default function page() {
  return (
    <div>
      <Heading title="New Consultant" />
      <ConsultantForm />
    </div>
  );
}
