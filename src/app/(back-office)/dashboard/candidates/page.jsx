import React from "react";
import { candidates } from "@/data";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import Heading from "@/components/backOffice/Heading";
import DownloadExcel from "@/components/backOffice/DownloadExcel";

export default function page() {
  // const jobs = await getData("jobs");
  return (
    <div>
      <div className="mt-4 py-4">
        {/* Header */}
        <Heading title="Candidates" />
      </div>

      <div className="flex justify-end">
        <DownloadExcel data={candidates} fileName="candidates.xlsx" />
      </div>

      {/* table */}
      <div className="py-8">
        <DataTable data={candidates} columns={columns} />
      </div>
    </div>
  );
}
