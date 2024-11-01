"use client";
import React, { useEffect, useState } from "react";
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
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the job from the API
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job");
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

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
  };

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
  console.log(job);

  return (
    <div className="min-h-screen gap-4">
      {/* Job Detail Section */}
      <div
        className={`bg-slate-200 dark:bg-zinc-800 rounded-xl ${
          isDesktop ? "flex gap-4" : "flex flex-col gap-4"
        } py-4 px-4`}
      >
        {/* Company Icon and Job Title: Takes 1/3 of the screen */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-between gap-2 space-y-1.5 text-center sm:text-left">
          <Image
            src={job?.jobCompany?.companyLogo || "/bankLogo/dcbbank.jpeg"}
            alt={job.companyName || "Company Logo"}
            unoptimized={true}
            height={400}
            width={400}
            className="h-40 w-40"
          />
          <h1 className="text-2xl">{job.jobTitle}</h1>
        </div>

        {/* Other Job Details: Takes 2/3 of the screen */}
        <div className="w-full md:w-2/3 overflow-auto">
          <JobDetail
            title="Company Name"
            detail={job?.jobCompany?.companyName}
          />
          <JobDetail title="Job Description" detail={job.jobDescription} />
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
        {applicants.length > 0 ? (
          <DataTable
            data={applicants}
            columns={columns(updateStatus)}
            filterKeys={["firstName", "lastName", "location"]}
          />
        ) : (
          <div className="text-center text-gray-500">
            No applicants for this job.
          </div>
        )}
      </div>
    </div>
  );
}
