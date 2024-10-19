import BulkUpload from "@/components/backOffice/BulkUpload";
import Heading from "@/components/backOffice/Heading";
import PageHeader from "@/components/backOffice/PageHeader";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="mt-4 py-4">
        {/* Header */}
        <Heading title="Bulk Upload" />
        <BulkUpload />
      </div>
      {/* <PageHeader
        heading={"Consultants"}
        href={"/dashboard/consultants/new"}
        linkTitle={"Add Consultant"}
      /> */}
    </div>
  );
}
