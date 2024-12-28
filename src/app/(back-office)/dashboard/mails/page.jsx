"use client";
import EmailEditor from "@/components/backOffice/EmailEditor";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";
import { useCandidates } from "@/context/CandidatesContext";
import { fetcher } from "@/lib/fetcher";
import React from "react";
import useSWR from "swr";

export default function Page() {
  const { selectedCandidates } = useCandidates();
  // console.log(selectedCandidates);
  const { data, error } = useSWR("/api/templates", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  if (error) return <div>Error loading templates.</div>;
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <AnimatedBoxes />
      </div>
    );
  console.log(data);

  return (
    <EmailEditor templates={data?.templatesData} data={selectedCandidates} />
  );
}
