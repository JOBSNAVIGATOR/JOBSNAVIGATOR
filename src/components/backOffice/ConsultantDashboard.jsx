import React from "react";
import DashboardChart from "./DashboardChart";

export default function ConsultantDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
      <DashboardChart />
      <DashboardChart />
      <DashboardChart />
      <DashboardChart />
    </div>
  );
}
