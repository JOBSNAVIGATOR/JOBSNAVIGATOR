"use client";
import React from "react";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import Heading from "@/components/backOffice/Heading";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import DownloadCSV from "@/components/backOffice/DownloadCsv";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";

export default function Page() {
  // const jobs = await getData("jobs");

  const { data, error } = useSWR("/api/candidates", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  if (error) return <div>Error loading candidates.</div>;
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <AnimatedBoxes />
      </div>
    );
  // console.log(data);

  // Clean the data to remove noise
  // const cleanData = data.map((row) => {
  //   const cleanedRow = {};
  //   for (let key in row) {
  //     if (row[key] !== undefined && row[key] !== null) {
  //       cleanedRow[key] = row[key];
  //     }
  //   }
  //   return cleanedRow;
  // });

  const cleanData = data.map((row) => {
    const cleanedRow = {};
    for (let key in row) {
      // Exclude the 'resume' field
      if (key !== "resume" && row[key] !== undefined && row[key] !== null) {
        cleanedRow[key] = row[key];
      }
    }
    return cleanedRow;
  });

  return (
    <div>
      <div className="mt-4 py-4">
        {/* Header */}
        <Heading title="Candidates" />
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/dashboard/candidates/bulkUpload">
          <button className="bg-gradient-to-br group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 text-center items-center shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
            Bulk Upload
          </button>
        </Link>
        <Link href="/dashboard/candidates/new">
          <button className="bg-gradient-to-br group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 text-center items-center shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
            Add Candidate
          </button>
        </Link>
        <DownloadCSV data={cleanData} fileName="candidates" />
      </div>

      {/* table */}
      <div className="py-8">
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}
