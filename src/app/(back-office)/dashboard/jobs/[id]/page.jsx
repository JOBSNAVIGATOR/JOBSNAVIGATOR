"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";
import ApplicantsMasterTable from "./ApplicantsMasterTable";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

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
  // const [error, setError] = useState(null);
  const [formattedApplicants, setFormattedApplicants] = useState([]);

  const { data, error } = useSWR(`/api/jobs/${id}`, fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint
  useEffect(() => {
    if (data) {
      setJob(data);

      const applicants = data?.jobApplicants || [];
      const formatted = applicants.map((applicant) => ({
        id: applicant?.candidateProfile?.id,
        candidateCode: applicant?.candidateProfile?.candidateCode,
        name: applicant?.candidateProfile?.user?.name,
        email: applicant?.candidateProfile?.user?.email,
        contactNumber: applicant?.candidateProfile?.user?.contactNumber,
        sectorName: applicant?.candidateProfile?.sector?.sectorName,
        domainName: applicant?.candidateProfile?.domain?.name,
        designation: applicant?.candidateProfile?.designation,
        totalWorkingExperience:
          applicant?.candidateProfile?.totalWorkingExperience,
        currentCtc: applicant?.candidateProfile?.currentCtc,
        currentJobLocation: applicant?.candidateProfile?.currentJobLocation,
        currentCompany: applicant?.candidateProfile?.currentCompany,
        status: applicant?.status,
        resume: applicant?.candidateProfile?.resume,
        jobId: id,
        jobApplicantId: applicant?.id,
      }));

      setFormattedApplicants(formatted);
    }
  }, [data, id]); // Runs only when `data` changes
  if (error) return <div>Error loading applicants.</div>;
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <AnimatedBoxes />
      </div>
    );
  return (
    <div className="min-h-screen gap-4">
      {/* Job Detail Section */}
      <div
        className={`bg-slate-200 dark:bg-zinc-800 rounded-xl ${
          isDesktop ? "flex gap-4" : "flex flex-col gap-4"
        } py-4 px-4`}
      >
        {/* Company Icon and Job Title */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-between gap-2 space-y-1.5 text-center sm:text-left">
          <Image
            src={job?.jobCompany?.companyLogo || "/bankLogo/dcbbank.jpeg"}
            alt={job?.jobCompany?.companyName || "Company Logo"}
            unoptimized={true}
            height={400}
            width={400}
            className="h-40 w-40"
          />
          <h1 className="text-2xl">{job?.jobTitle}</h1>
        </div>

        {/* Other Job Details */}
        <div className="w-full md:w-2/3 overflow-auto">
          <JobDetail
            title="Company Name"
            detail={job?.jobCompany?.companyName}
          />
          <JobDetail title="Job Description" detail={job?.jobDescription} />
          <JobDetail title="Location" detail={job?.jobLocation} />
          <JobDetail title="CTC" detail={`${job?.jobSalary} LPA`} />
          <JobDetail
            title="Desired Skills"
            detail={job?.skillsRequired.join(", ")}
          />
        </div>
      </div>

      {/* Applicants Table */}
      <div className="py-8">
        {formattedApplicants.length > 0 ? (
          <ApplicantsMasterTable data={formattedApplicants} />
        ) : (
          <div className="text-center text-gray-500">
            No applicants for this job.
          </div>
        )}
      </div>
    </div>
  );
}
