import PageHeader from "@/components/backOffice/PageHeader";
import React from "react";
import { consultants } from "@/data";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";

export default function page() {
  // const jobs = await getData("jobs");
  return (
    <div>
      {/* Header */}
      <PageHeader
        heading={"Consultants"}
        href={"/dashboard/consultants/new"}
        linkTitle={"Add Consultant"}
      />

      {/* table */}
      <div className="py-8">
        <DataTable data={consultants} columns={columns} />
      </div>
    </div>
  );
}
