"use client";
import React from "react";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import Heading from "@/components/backOffice/Heading";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import DownloadCSV from "@/components/backOffice/DownloadCsv";
import PageHeader from "@/components/backOffice/PageHeader";

export default function Page() {
  const { data: jobs, error } = useSWR("/api/jobs", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  if (error) return <div>Error loading jobs.</div>;
  if (!jobs) return <div>Loading...</div>;
  console.log("jobs", jobs);

  // Customize job data
  const customizedJobData = jobs.map((job) => {
    const {
      id,
      jobId,
      jobTitle,
      jobSector,
      jobDomain,
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
      jobTitle,
      jobSector,
      jobDomain,
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

  console.log("customized ", customizedJobData);

  return (
    <div>
      {/* Header */}
      <PageHeader
        heading={"Jobs"}
        href={"/dashboard/jobs/new"}
        linkTitle={"Post Job"}
      />
      {/* <div className="flex justify-end">
        <DownloadExcel data={jobs} fileName="jobs.xlsx" />
      </div> */}

      {/* table */}
      <div className="py-8">
        <DataTable
          data={customizedJobData}
          columns={columns}
          filterKeys={["jobSector", "jobDomain", "jobLocation"]}
        />
      </div>
    </div>
  );
}
