"use client";
import PageHeader from "@/components/backOffice/PageHeader";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";
import ConsultantMasterTable from "./ConsultantMasterTable";
import { useSession } from "next-auth/react";
import useHasPermission from "@/hooks/useHasPermission";

export default function Page() {
  // const jobs = await getData("jobs");
  const { data, error } = useSWR("/api/consultants", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  console.log("data", data);

  const { data: session, status } = useSession();
  const hasPermissionToAddConsultant = useHasPermission("addConsultant");
  const hasPermissionToEditConsultant = useHasPermission("editConsultant");
  const hasPermissionToDeleteConsultant = useHasPermission("deleteConsultant");
  const hasPermissionToAssignJobToConsultants = useHasPermission(
    "assignJobToConsultants"
  );
  const hasPermissionToManageConsultant = useHasPermission("manageConsultant");
  const hasPermissionToChangeVisibilityOfCandidates = useHasPermission(
    "changeVisibilityOfCandidates"
  );
  if (status === "loading") {
    // <Loading />;
    return <p>Loading...</p>; // ✅ Now properly rendering the loading state
  }
  if (error) return <div>Error loading consultants.</div>;
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <AnimatedBoxes />
      </div>
    );
  const canAddConsultant =
    session?.user?.role === "ADMIN" ? true : hasPermissionToAddConsultant;
  const canEditConsultant =
    session?.user?.role === "ADMIN" ? true : hasPermissionToEditConsultant;
  const canDeleteConsultant =
    session?.user?.role === "ADMIN" ? true : hasPermissionToDeleteConsultant;
  const canAssignJobToConsultants =
    session?.user?.role === "ADMIN"
      ? true
      : hasPermissionToAssignJobToConsultants;
  const canManageConsultant =
    session?.user?.role === "ADMIN" ? true : hasPermissionToManageConsultant;
  const canChangeVisibilityOfCandidates =
    session?.user?.role === "ADMIN"
      ? true
      : hasPermissionToChangeVisibilityOfCandidates;

  return (
    <div>
      {/* Header */}
      <PageHeader
        heading={"Consultants"}
        href={"/dashboard/consultants/new"}
        linkTitle={"Add Consultant"}
        canUseFeature={canAddConsultant}
      />

      {/* table */}
      <div className="py-8">
        <ConsultantMasterTable
          data={data}
          canEditConsultant={canEditConsultant}
          canDeleteConsultant={canDeleteConsultant}
          canAssignJobToConsultants={canAssignJobToConsultants}
          canManageConsultant={canManageConsultant}
          canChangeVisibilityOfCandidates={canChangeVisibilityOfCandidates}
        />
      </div>
    </div>
  );
}
