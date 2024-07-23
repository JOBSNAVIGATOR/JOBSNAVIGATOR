import JobCard from "@/components/frontOffice/JobCard";
import { jobs } from "@/data";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-6 xl:grid-cols-4 gap-6 py-8 my-4">
        {jobs && jobs.length > 0
          ? jobs.map((jobItem) => (
              <JobCard key={jobItem.jobId} jobItem={jobItem} />
            ))
          : null}
      </div>
    </div>
  );
}
