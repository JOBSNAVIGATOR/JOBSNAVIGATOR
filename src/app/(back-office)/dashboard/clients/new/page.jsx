import FormHeader from "@/components/backOffice/FormHeader";
import ClientFormTwo from "@/components/backOffice/forms/ClientFormTwo";
import React from "react";

export default function page() {
  return (
    <div>
      <FormHeader title="New Client" />
      <ClientFormTwo />
    </div>
  );
}
