"use client";
import React from "react";
import { jobs } from "@/data";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import useMediaQuery from "@custom-react-hooks/use-media-query";

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
      <div className="h-96 bg-red-600 my-8"></div>
    </div>
  );
}
