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
import { useSession } from "next-auth/react";
import useHasPermission from "@/hooks/useHasPermission";
import ClientMasterTable from "./ClientMasterTable";

export default function Page() {
  const { data, error } = useSWR("/api/clients", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint
  const { data: session, status } = useSession();
  const hasPermissionToAddClient = useHasPermission("addClient"); // ✅ Hook must be called at the top level
  const hasPermissionToEditClient = useHasPermission("editClient"); // ✅ Hook must be called at the top level
  const hasPermissionToDeleteClient = useHasPermission("deleteClient"); // ✅ Hook must be called at the top level
  if (status === "loading") {
    // <Loading />;
    return <p>Loading...</p>; // ✅ Now properly rendering the loading state
  }
  if (error) return <div>Error loading clients.</div>;
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <AnimatedBoxes />
      </div>
    );
  const canAddClient =
    session?.user?.role === "ADMIN" ? true : hasPermissionToAddClient;
  const canEditClient =
    session?.user?.role === "ADMIN" ? true : hasPermissionToEditClient;
  const canDeleteClient =
    session?.user?.role === "ADMIN" ? true : hasPermissionToDeleteClient;

  return (
    <div>
      <div className="mt-4 py-4">
        {/* Header */}
        <Heading title="Clients" />
      </div>

      <div className="flex justify-end gap-4">
        {canAddClient && (
          <Link href="/dashboard/clients/new">
            <button className="bg-gradient-to-br group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 text-center items-center shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
              Add Client
            </button>
          </Link>
        )}
      </div>

      {/* table */}
      <div className="py-8">
        {/* <DataTable data={data} columns={columns} /> */}
        <ClientMasterTable
          data={data}
          canEditClient={canEditClient}
          canDeleteClient={canDeleteClient}
        />
      </div>
    </div>
  );
}
