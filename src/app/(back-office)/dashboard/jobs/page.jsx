"use client";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import PageHeader from "@/components/backOffice/PageHeader";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";
import JobMasterTable from "./JobMasterTable";
import { useSession } from "next-auth/react";
import { data } from "autoprefixer";
import useHasPermission from "@/hooks/useHasPermission";

export default function Page() {
  const { data: jobs, error } = useSWR("/api/jobs", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint
  const { data: session, status } = useSession();
  // Determine if the user can post a job
  const hasPermissionToPostJob = useHasPermission("postJob"); // ✅ Hook must be called at the top level

  if (status === "loading") {
    // <Loading />;
    return <p>Loading...</p>; // ✅ Now properly rendering the loading state
  }
  const canPostJob =
    session?.user?.role === "ADMIN" ? true : hasPermissionToPostJob;

  console.log(canPostJob);

  if (error) return <div>Error loading jobs.</div>;
  if (!jobs)
    return (
      <div className="flex justify-center items-center h-screen">
        <AnimatedBoxes />
      </div>
    );

  // Customize job data
  const customizedJobData = jobs.map((job) => {
    const {
      id,
      jobId,
      jobCode,
      jobTitle,
      sector: { sectorName },
      domain: { name },
      jobLocation,
      jobSalary,
      jobVacancies,
      jobVacanciesRemaining,
      skillsRequired,
      createdAt,
      updatedAt,
      consultantId,
      isActive,
      jobDescription,
      jobApplicants,
      jobCompany: {
        companyDescription,
        companyLogo,
        companyName,
        createdAt: companyCreatedAt,
        id: companyId,
        updatedAt: companyUpdatedAt,
      },
      clientSpoc,
    } = job;

    return {
      id,
      jobId,
      jobCode,
      jobTitle,
      jobSector: sectorName,
      jobDomain: name,
      jobLocation,
      jobSalary,
      jobVacancies,
      jobVacanciesRemaining,
      skillsRequired,
      createdAt,
      updatedAt,
      consultantId,
      isActive,
      jobDescription,
      jobApplicants,
      companyId,
      companyDescription,
      companyLogo,
      companyName,
      companyCreatedAt,
      companyUpdatedAt,
      clientSpocName: clientSpoc?.user?.name.toUpperCase() || "N/A", // safely access clientSpoc.user.name
    };
  });
  // console.log(customizedJobData);

  return (
    <div>
      {/* Header */}
      <PageHeader
        heading={"Jobs"}
        href={"/dashboard/jobs/new"}
        linkTitle={"Post Job"}
        canUseFeature={canPostJob}
      />
      {/* table */}
      <div className="py-8">
        <JobMasterTable data={customizedJobData} />
      </div>
    </div>
  );
}
