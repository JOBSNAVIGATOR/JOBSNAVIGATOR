"use client";

import React from "react";
import useSWR from "swr";
import DynamicDonutChart from "./DynamicDonutChart";
import { fetcher } from "@/lib/fetcher";

// SWR fetcher

export default function ConsultantDashboard() {
  const { data: stats, error } = useSWR("/api/dashboardStats", fetcher);

  if (error) return <div className="text-red-500">Error loading stats</div>;
  if (!stats) return <div>Loading...</div>;

  const entityData = [
    {
      id: 0,
      label: "All Candidates",
      value: stats.candidateCount,
    },
    {
      id: 1,
      label: "Manual Candidates",
    },
    {
      id: 2,
      label: "Consultants",
      value: stats.consultantCount,
    },
    {
      id: 3,
      label: "Clients",
      value: stats.clientCount,
    },
    {
      id: 4,
      label: "Companies",
      value: stats.companyCount,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
      <DynamicDonutChart chartData={entityData} title="Entities Data" />
      <DynamicDonutChart
        chartData={stats.candidatesByDistrict}
        title="Candidates Location Wise"
      />
      <DynamicDonutChart
        chartData={stats.candidatesByDomain}
        title="Candidates Domain Wise"
      />
      <DynamicDonutChart
        chartData={stats.jobStats}
        title="Candidates Job Wise"
      />
    </div>
  );
}
