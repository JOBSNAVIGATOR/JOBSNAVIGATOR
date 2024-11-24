import React from "react";
import JobCard from "./JobCard";

export default function JobsSection({ jobs }) {
  // console.log("jobsection", jobs);

  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-6 xl:grid-cols-4 gap-6 py-8 my-4">
      {jobs && jobs.length > 0
        ? jobs.map((jobItem) => <JobCard key={jobItem.id} jobItem={jobItem} />)
        : null}
    </div>
  );
}
