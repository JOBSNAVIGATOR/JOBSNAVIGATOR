"use client";
import React from "react";
import Heading from "@/components/backOffice/Heading";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";
import CandidateMasterTable from "./CandidateMasterTable";
import { useSession } from "next-auth/react";
import useHasPermission from "@/hooks/useHasPermission";

export default function Page() {
  const { data, error } = useSWR("/api/candidates", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint
  const { data: session, status } = useSession();
  const hasPermissionToAddCandidate = useHasPermission("addCandidate");
  const hasPermissionToEditCandidate = useHasPermission("editCandidate");
  const hasPermissionToDeleteCandidate = useHasPermission("deleteCandidate");
  const hasPermissionToBulkUpload = useHasPermission("bulkUpload");
  if (status === "loading") {
    // <Loading />;
    return <p>Loading...</p>; // ✅ Now properly rendering the loading state
  }

  if (error) return <div>Error loading candidates.</div>;
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <AnimatedBoxes />
      </div>
    );
  // console.log(data);
  const canAddCandidate =
    session?.user?.role === "ADMIN" ? true : hasPermissionToAddCandidate;
  const canEditCandidate =
    session?.user?.role === "ADMIN" ? true : hasPermissionToEditCandidate;
  const canDeleteCandidate =
    session?.user?.role === "ADMIN" ? true : hasPermissionToDeleteCandidate;
  const canBulkUpload =
    session?.user?.role === "ADMIN" ? true : hasPermissionToBulkUpload;

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
        {canBulkUpload && (
          <Link href="/dashboard/candidates/bulkUpload">
            <button className="bg-gradient-to-br group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 text-center items-center shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
              Bulk Upload
            </button>
          </Link>
        )}
        {canAddCandidate && (
          <Link href="/dashboard/candidates/new">
            <button className="bg-gradient-to-br group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 text-center items-center shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
              Add Candidate
            </button>
          </Link>
        )}

        {/* <DownloadCSV data={cleanData} fileName="candidates" /> */}
      </div>

      {/* table */}
      <div className="py-8">
        {/* <DataTableModified
          data={data}
          columns={columns}
          filterKeys={["name", "email", "currentJobLocation", "currentCompany"]}
        /> */}
        <CandidateMasterTable
          data={data}
          canEditCandidate={canEditCandidate}
          canDeleteCandidate={canDeleteCandidate}
        />
      </div>
    </div>
  );
}
