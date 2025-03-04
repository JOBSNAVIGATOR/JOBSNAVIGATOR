"use client";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import PageHeader from "@/components/backOffice/PageHeader";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";
import { useSession } from "next-auth/react";
import useHasPermission from "@/hooks/useHasPermission";
import ClientCompanyMasterTable from "./ClientCompanyMasterTable";

export default function Page() {
  // const jobs = await getData("jobs");

  const { data, error } = useSWR("/api/companies", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint
  const { data: session, status } = useSession();
  const hasPermissionToAddCompany = useHasPermission("addCompany");
  const hasPermissionToEditCompany = useHasPermission("editCompany");
  const hasPermissionToDeleteCompany = useHasPermission("deleteCompany");
  if (status === "loading") {
    // <Loading />;
    return <p>Loading...</p>; // ✅ Now properly rendering the loading state
  }

  if (error) return <div>Error loading companies.</div>;
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <AnimatedBoxes />
      </div>
    );
  const canAddCompany =
    session?.user?.role === "ADMIN" ? true : hasPermissionToAddCompany;
  const canEditCompany =
    session?.user?.role === "ADMIN" ? true : hasPermissionToEditCompany;
  const canDeleteCompany =
    session?.user?.role === "ADMIN" ? true : hasPermissionToDeleteCompany;

  return (
    <div>
      {/* Header */}
      <PageHeader
        heading={"Companies"}
        href={"/dashboard/clientCompanies/new"}
        linkTitle={"Add Company"}
        canUseFeature={canAddCompany}
      />

      {/* table */}
      <div className="py-8">
        <ClientCompanyMasterTable
          data={data}
          canEditCompany={canEditCompany}
          canDeleteCompany={canDeleteCompany}
        />
      </div>
    </div>
  );
}
