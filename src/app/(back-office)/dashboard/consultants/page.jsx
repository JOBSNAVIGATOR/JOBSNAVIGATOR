"use client";
import PageHeader from "@/components/backOffice/PageHeader";
import React from "react";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";

export default function Page() {
  // const jobs = await getData("jobs");
  const { data, error } = useSWR("/api/consultants", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  if (error) return <div>Error Loading Consultants.</div>;
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <AnimatedBoxes />
      </div>
    );
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
