import React from "react";
import { candidates } from "@/data";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import Heading from "@/components/backOffice/Heading";

export default function page() {
  // const jobs = await getData("jobs");
  return (
    <div>
      <div className="mt-4 py-4">
        {/* Header */}
        <Heading title="Candidates" />
      </div>

      {/* table */}
      <div className="py-8">
        <DataTable data={candidates} columns={columns} />
      </div>
    </div>
  );
}
