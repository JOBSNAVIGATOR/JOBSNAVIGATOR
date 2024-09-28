"use client";
import React from "react";
import { candidates } from "@/data";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import Heading from "@/components/backOffice/Heading";
import DownloadExcel from "@/components/backOffice/DownloadExcel";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function page() {
  // const jobs = await getData("jobs");

  const { data, error } = useSWR("/api/candidates", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  if (error) return <div>Error loading candidates.</div>;
  if (!data) return <div>Loading...</div>;
  console.log(data);

  return (
    <div>
      <div className="mt-4 py-4">
        {/* Header */}
        <Heading title="Candidates" />
      </div>

      <div className="flex justify-end">
        <DownloadExcel data={data} fileName="candidates.xlsx" />
      </div>

      {/* table */}
      <div className="py-8">
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}
