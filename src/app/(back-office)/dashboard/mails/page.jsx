"use client";
import EmailEditor from "@/components/backOffice/EmailEditor";
import { useCandidates } from "@/context/CandidatesContext";
import { templates } from "@/data";
import React from "react";

export default function Page() {
  const emailTemplates = templates;
  const { selectedCandidates } = useCandidates();
  // console.log(selectedCandidates);

  return <EmailEditor templates={emailTemplates} data={selectedCandidates} />;
}
