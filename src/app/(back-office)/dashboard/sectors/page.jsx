"use client";
import React from "react";
import Heading from "@/components/backOffice/Heading";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import { useSession } from "next-auth/react";
import useHasPermission from "@/hooks/useHasPermission";
import SectorMasterTable from "./SectorMasterTable";

export default function Page() {
  const { data, error } = useSWR("/api/sectors", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  const { data: session, status } = useSession();
  const hasPermissionToAddSector = useHasPermission("addSector");
  const hasPermissionToEditSector = useHasPermission("editSector");
  const hasPermissionToDeleteSector = useHasPermission("deleteSector");
  if (status === "loading") {
    // <Loading />;
    return <p>Loading...</p>; // ✅ Now properly rendering the loading state
  }

  if (error) return <div>Error loading sectors.</div>;
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <AnimatedBoxes />
      </div>
    );
  const canAddSector =
    session?.user?.role === "ADMIN" ? true : hasPermissionToAddSector;
  const canEditSector =
    session?.user?.role === "ADMIN" ? true : hasPermissionToEditSector;
  const canDeleteSector =
    session?.user?.role === "ADMIN" ? true : hasPermissionToDeleteSector;
  // Transform the data to include only the id, sectorName, and an array of domain names
  const transformedData = data.map((sector) => ({
    id: sector.id,
    sectorName: sector.sectorName,
    domains: sector.domains ? sector.domains.map((domain) => domain.name) : [],
  }));
  // console.log("modified data", transformedData);

  return (
    <div>
      <div className="mt-4 py-4">
        {/* Header */}
        <Heading title="Sectors & Domains" />
      </div>

      {canAddSector && (
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/sectors/new">
            <button className="bg-gradient-to-br group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 text-center items-center shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
              Create Sector
            </button>
          </Link>
        </div>
      )}

      {/* table */}
      <div className="py-8">
        {/* <DataTable data={transformedData} columns={columns} /> */}
        <SectorMasterTable
          data={transformedData}
          canEditSector={canEditSector}
          canDeleteSector={canDeleteSector}
        />
      </div>
    </div>
  );
}
