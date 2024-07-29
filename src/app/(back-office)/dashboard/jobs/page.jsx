import PageHeader from "@/components/backOffice/PageHeader";
import React from "react";
export default function page() {
  // const jobs = await getData("jobs");
  return (
    <div>
      {/* Header */}
      <PageHeader
        heading={"Jobs"}
        href={"/dashboard/jobs/new"}
        linkTitle={"Post Job"}
      />
    </div>
  );
}
