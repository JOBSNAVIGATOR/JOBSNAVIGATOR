"use client";
import PageHeader from "@/components/backOffice/PageHeader";
import React from "react";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function Page() {
  // const jobs = await getData("jobs");
  const { data, error } = useSWR("/api/consultants", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  if (error) return <div>Error loading conslutants.</div>;
  if (!data) return <div>Loading...</div>;
  // console.log(data);

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
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}
