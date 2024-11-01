import FormHeader from "@/components/backOffice/FormHeader";
import React from "react";

export default async function UpdateJob({ params: { id } }) {
  return (
    <div>
      <FormHeader title="Update Company" />
      {/* <CategoryForm updateData={category} /> */}
      <h2>id : {id}</h2>
    </div>
  );
}
