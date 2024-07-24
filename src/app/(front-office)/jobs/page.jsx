"use client";
import FilterSection from "@/components/frontOffice/jobs/FilterSection";
import JobCard from "@/components/frontOffice/jobs/JobCard";
import JobsSection from "@/components/frontOffice/jobs/JobsSection";
import { jobs } from "@/data";
import React, { useState } from "react";

export default function Jobs() {
  const [filteredJobs, setFilteredJobs] = useState([]);
  return (
    <div className="max-w-7xl mx-auto">
      {/* will contain 2 sections , left section will have different filters and right side will render the jobs on the basis of filters */}
      <div className="flex flex-col lg:flex-row">
        {/* filter section */}
        <FilterSection
          jobs={jobs}
          filteredJobs={filteredJobs}
          setFilteredJobs={setFilteredJobs}
        />

        {/* jobs section */}
        <JobsSection jobs={filteredJobs} />
      </div>
    </div>
  );
}
