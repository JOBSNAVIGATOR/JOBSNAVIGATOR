"use client";
import EmailEditor from "@/components/backOffice/EmailEditor";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";
import { useCandidates } from "@/context/CandidatesContext";
import useHasPermission from "@/hooks/useHasPermission";
import { fetcher } from "@/lib/fetcher";
import { useSession } from "next-auth/react";
import React from "react";
import useSWR from "swr";

export default function Page() {
  const { selectedCandidates } = useCandidates();
  // console.log(selectedCandidates);
  const { data, error } = useSWR("/api/templates", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint
  const { data: session, status } = useSession();
  const hasPermissionToAddMailTemplate = useHasPermission("addMailTemplate");
  const hasPermissionToEditMailTemplate = useHasPermission("editMailTemplate");
  const hasPermissionToDeleteMailTemplate =
    useHasPermission("deleteMailTemplate");

  if (status === "loading") {
    // <Loading />;
    return <p>Loading...</p>; // ✅ Now properly rendering the loading state
  }
  if (error) return <div>Error loading Templates.</div>;
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <AnimatedBoxes />
      </div>
    );
  const canAddMailTemplate =
    session?.user?.role === "ADMIN" ? true : hasPermissionToAddMailTemplate;
  const canEditMailTemplate =
    session?.user?.role === "ADMIN" ? true : hasPermissionToEditMailTemplate;
  const canDeleteMailTemplate =
    session?.user?.role === "ADMIN" ? true : hasPermissionToDeleteMailTemplate;

  return (
    <EmailEditor
      templates={data?.templatesData}
      data={selectedCandidates}
      canAddMailTemplate={canAddMailTemplate}
      canEditMailTemplate={canEditMailTemplate}
      canDeleteMailTemplate={canDeleteMailTemplate}
    />
  );
}
