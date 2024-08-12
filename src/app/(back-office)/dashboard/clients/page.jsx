import PageHeader from "@/components/backOffice/PageHeader";
import React from "react";
import { consultants } from "@/data";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import DownloadExcel from "@/components/backOffice/DownloadExcel";

export default function page() {
  // const jobs = await getData("jobs");
  return (
    <div>
      {/* Header */}
      <PageHeader
        heading={"Clients"}
        href={"/dashboard/clients/new"}
        linkTitle={"Add Client"}
      />

      <div className="flex justify-end">
        <DownloadExcel data={consultants} fileName="clients.xlsx" />
      </div>

      {/* table */}
      <div className="py-8">
        <DataTable data={consultants} columns={columns} />
      </div>
    </div>
  );
}
