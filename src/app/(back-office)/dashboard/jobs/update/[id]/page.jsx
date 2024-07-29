import FormHeader from "@/components/backoffice/FormHeader";
import { getData } from "@/lib/getData";
import React from "react";

export default async function UpdateJob({ params: { id } }) {
  // const category = await getData(`categories/${id}`);
  return (
    <div>
      <FormHeader title="Update Job" />
      {/* <CategoryForm updateData={category} /> */}
    </div>
  );
}
