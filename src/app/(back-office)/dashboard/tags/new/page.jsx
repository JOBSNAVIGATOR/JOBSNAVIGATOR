import FormHeader from "@/components/backOffice/FormHeader";
import TagForm from "@/components/backOffice/forms/TagForm";
import React from "react";

export default function page() {
  return (
    <div>
      <FormHeader title="New Tag" />
      <TagForm />
    </div>
  );
}
