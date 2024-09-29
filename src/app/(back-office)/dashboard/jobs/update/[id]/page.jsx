import FormHeader from "@/components/backOffice/FormHeader";
// import { getData } from "@/lib/getData";
import React from "react";

export default async function UpdateJob({ params: { id } }) {
  // const category = await getData(`categories/${id}`);
  return (
    <div>
      <FormHeader title="Update Job" />
      {/* <CategoryForm updateData={category} /> */}
      <h2>id : {id}</h2>
    </div>
  );
}
