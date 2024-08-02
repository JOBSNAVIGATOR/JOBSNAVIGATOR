import PageHeader from "@/components/backOffice/PageHeader";
import React from "react";
import { jobs } from "@/data";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";

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

      {/* table */}
      <div className="py-8">
        <DataTable
          data={jobs}
          columns={columns}
          filterKeys={["jobSector", "jobDomain", "jobLevel", "jobLocation"]}
        />
      </div>
    </div>
  );
}
