"use client";
import FilterSection from "@/components/frontOffice/jobs/FilterSection";
import JobsSection from "@/components/frontOffice/jobs/JobsSection";
import { fetcher } from "@/lib/fetcher";
import React, { useState } from "react";
import useSWR from "swr";

export default function Jobs() {
  // useSWR should always be called at the top level of your component
  const { data: jobs, error } = useSWR("/api/jobs", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  });

  // Initialize state outside of any conditional logic
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Handle loading and error states without affecting the hooks order
  if (error) return <div>Error loading jobs.</div>;
  if (!jobs) return <div>Loading...</div>;

  // console.log(jobs);

  return (
    <div className="max-w-7xl mx-auto">
      {/* will contain 2 sections, left section will have different filters and right side will render the jobs on the basis of filters */}
      <div className="flex flex-col lg:flex-row">
        {/* Filter section */}
        <FilterSection
          jobs={jobs}
          filteredJobs={filteredJobs}
          setFilteredJobs={setFilteredJobs}
        />

        {/* Jobs section */}
        <JobsSection jobs={filteredJobs} />
      </div>
    </div>
  );
}
