import FormHeader from "@/components/backOffice/FormHeader";
import ClientForm from "@/components/backOffice/forms/ClientForm";
import React from "react";

export default function page() {
  return (
    <div>
      <FormHeader title="New Client" />
      <ClientForm />
    </div>
  );
}
