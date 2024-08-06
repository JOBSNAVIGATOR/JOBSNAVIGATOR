"use client";
import React from "react";
import { jobs, candidates } from "@/data";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import useMediaQuery from "@custom-react-hooks/use-media-query";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";

// Common Job Detail Component
const JobDetail = ({ title, detail }) => (
  <div className="flex mb-2">
    <h2 className="flex w-40 justify-between">
      <span className="font-bold">{title}</span>
      <ArrowRight className="h-4 w-4 mx-2" />
    </h2>
    <div className="flex-1">{detail}</div>
  </div>
);

export default function Page({ params: { id } }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const job = jobs.find((job) => job.jobId === id);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Job not found
      </div>
    );
  }

  const updateStatus = (candidateId, newStatus) => {
    // Update status in your state or backend
    console.log(`Updating status for candidate ${candidateId} to ${newStatus}`);
    // Example: call API or update local state
  };

  // const updateStatus = async (candidateId, newStatus) => {
  //   try {
  //     await fetch(`/api/candidates/${candidateId}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ status: newStatus }),
  //     });
  //     console.log(`Status updated for candidate ${candidateId}`);
  //   } catch (error) {
  //     console.error('Failed to update status:', error);
  //   }
  // };

  const applicants = candidates
    .map((candidate) => {
      // Find the application status for the job
      const application = candidate.applications.find(
        (app) => app.jobId === id
      );
      return {
        ...candidate,
        status: application ? application.status : "Not Applied",
      };
    })
    .filter((candidate) => job.jobApplicants.includes(candidate.id));

  console.log(applicants);

  return (
    <div className="min-h-screen gap-4">
      {/* Job Detail Section */}
      <div
        className={`bg-slate-200 dark:bg-zinc-800 rounded-xl ${
          isDesktop ? "flex gap-4" : "flex flex-col gap-4"
        } py-4 px-4`}
      >
        {/* Company Icon and Job Title */}
        <div className="flex flex-col items-center justify-between gap-2 space-y-1.5 text-center sm:text-left">
          <Image
            src={job.companyLogo || "/bankLogo/dcbbank.jpeg"}
            alt={job.companyName || "Company Logo"}
            height={400}
            width={400}
            className="h-40 w-40"
          />
          <h1 className="text-2xl">{job.jobTitle}</h1>
        </div>

        {/* Other Job Details */}
        <div className="overflow-auto">
          <JobDetail title="Job Description" detail={job.jobDescription} />
          <JobDetail title="Level" detail={job.jobLevel} />
          <JobDetail title="Location" detail={job.jobLocation} />
          <JobDetail title="CTC" detail={`${job.jobSalary} LPA`} />
          <JobDetail
            title="Desired Skills"
            detail={job.skillsRequired.join(", ")}
          />
        </div>
      </div>

      {/* Applicants Table */}
      <div className="py-8">
        <DataTable data={applicants} columns={columns(updateStatus)} />
      </div>
    </div>
  );
}
