"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FaFilter } from "react-icons/fa"; // Import an icon from react-icons

export default function FilterSection({ jobs, setFilteredJobs }) {
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchSkills, setSearchSkills] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 20]);
  const [isFilterVisible, setIsFilterVisible] = useState(false); // State to manage filter visibility

  // Extract unique values for each filter category
  const jobSectors = [...new Set(jobs.map((job) => job.jobSector))]
    .sort()
    .map((sector) => ({
      value: sector,
      label: sector,
    }));

  const jobDomains = [...new Set(jobs.map((job) => job.jobDomain))]
    .sort()
    .map((domain) => ({
      value: domain,
      label: domain,
    }));

  const jobLevels = [...new Set(jobs.map((job) => job.jobLevel))]
    .sort()
    .map((level) => ({
      value: level,
      label: level,
    }));

  const jobCompanies = [...new Set(jobs.map((job) => job.jobCompany))]
    .sort()
    .map((company) => ({
      value: company,
      label: company,
    }));

  const jobLocations = [...new Set(jobs.map((job) => job.jobLocation))]
    .sort()
    .map((location) => ({
      value: location,
      label: location,
    }));

  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const sectorMatch = selectedSectors.length
        ? selectedSectors.some((sector) => job.jobSector === sector.value)
        : true;
      const domainMatch = selectedDomains.length
        ? selectedDomains.some((domain) => job.jobDomain === domain.value)
        : true;
      const levelMatch = selectedLevels.length
        ? selectedLevels.some((level) => job.jobLevel === level.value)
        : true;
      const companyMatch = selectedCompanies.length
        ? selectedCompanies.some((company) => job.jobCompany === company.value)
        : true;
      const locationMatch = selectedLocations.length
        ? selectedLocations.some(
            (location) => job.jobLocation === location.value
          )
        : true;
      const skillsMatch = searchSkills
        ? job.skillsRequired.some((skill) =>
            skill.toLowerCase().includes(searchSkills.toLowerCase())
          )
        : true;
      const salaryMatch =
        job.jobSalary >= salaryRange[0] && job.jobSalary <= salaryRange[1];

      return (
        sectorMatch &&
        domainMatch &&
        levelMatch &&
        companyMatch &&
        locationMatch &&
        skillsMatch &&
        salaryMatch
      );
    });
    setFilteredJobs(filtered);
  }, [
    selectedSectors,
    selectedDomains,
    selectedLevels,
    selectedCompanies,
    selectedLocations,
    searchSkills,
    salaryRange,
    jobs,
    setFilteredJobs,
  ]);

  return (
    <>
      {/* Icon for filter section */}
      <div
        className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-3 rounded-full cursor-pointer md:hidden z-20"
        onClick={() => setIsFilterVisible(!isFilterVisible)}
      >
        <FaFilter size={24} />
      </div>

      {/* Filter section */}
      <div
        className={`w-full lg:w-[300px] lg:mt-12 lg:ml-8 h-auto rounded-xl lg:rounded-3xl z-[15] opacity-90 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)] sticky top-24 lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto p-4 flex-3 grid grid-cols-3 lg:flex lg:flex-col px-6 gap-2 py-8 md:hidden ${
          isFilterVisible ? "block opacity-100" : "hidden"
        }`}
      >
        {/* Search bar for skills */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by skills"
            value={searchSkills}
            onChange={(e) => setSearchSkills(e.target.value)}
            className="w-full px-4 py-2 rounded-xl dark:text-black"
          />
        </div>

        {/* Multi-select dropdowns for each filter */}
        <div className="mb-4">
          <Select
            isMulti
            value={selectedSectors}
            onChange={setSelectedSectors}
            options={jobSectors}
            placeholder="Select Sectors"
            className="w-full rounded-xl dark:text-black"
          />
        </div>
        <div className="mb-4">
          <Select
            isMulti
            value={selectedDomains}
            onChange={setSelectedDomains}
            options={jobDomains}
            placeholder="Select Domains"
            className="w-full rounded-xl dark:text-black"
          />
        </div>
        <div className="mb-4">
          <Select
            isMulti
            value={selectedLevels}
            onChange={setSelectedLevels}
            options={jobLevels}
            placeholder="Select Levels"
            className="w-full rounded-xl dark:text-black"
          />
        </div>
        <div className="mb-4">
          <Select
            isMulti
            value={selectedCompanies}
            onChange={setSelectedCompanies}
            options={jobCompanies}
            placeholder="Select Companies"
            className="w-full rounded-xl dark:text-black"
          />
        </div>
        <div className="mb-4">
          <Select
            isMulti
            value={selectedLocations}
            onChange={setSelectedLocations}
            options={jobLocations}
            placeholder="Select Locations"
            className="w-full rounded-xl dark:text-black"
          />
        </div>

        {/* Salary Slider */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span>Salary: {salaryRange[0]} LPA</span>
            <span>{salaryRange[1]} LPA</span>
          </div>
          <Slider
            range
            min={0}
            max={20}
            step={1}
            value={salaryRange}
            onChange={(range) => setSalaryRange(range)}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}
