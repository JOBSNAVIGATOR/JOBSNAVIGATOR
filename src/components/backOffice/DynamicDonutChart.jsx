"use client";

import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function DynamicDonutChart({ chartData, title }) {
  return (
    <div className="flex flex-col flex-wrap">
      <h2 className="text-center font-bold mb-8">{title}</h2>
      <PieChart
        className="border-4 border-dotted dark:border-white border-black p-1"
        series={[
          {
            data: chartData,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            // valueFormatter,
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 6,
            cornerRadius: 3,
            startAngle: -145,
            endAngle: 225,
          },
        ]}
        width={200}
        height={200}
      />
    </div>
  );
}
