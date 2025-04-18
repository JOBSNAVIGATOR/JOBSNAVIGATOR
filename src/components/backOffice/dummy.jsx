// "use client";

// import * as React from "react";
// import { TrendingUp } from "lucide-react";
// import { Label, Pie, PieChart } from "recharts";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

// export const description = "A donut chart with text";

// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome, #4285F4)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari, #00A1F1)" },
//   { browser: "firefox", visitors: 287, fill: "var(--color-firefox, #FF7139)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge, #0078D7)" },
//   { browser: "other", visitors: 190, fill: "var(--color-other, #6C757D)" },
// ];

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "Chrome",
//     color: "hsl(var(--chart-1))",
//   },
//   safari: {
//     label: "Safari",
//     color: "hsl(var(--chart-2))",
//   },
//   firefox: {
//     label: "Firefox",
//     color: "hsl(var(--chart-3))",
//   },
//   edge: {
//     label: "Edge",
//     color: "hsl(var(--chart-4))",
//   },
//   other: {
//     label: "Other",
//     color: "hsl(var(--chart-5))",
//   },
// };

// export default function DashboardChart() {
//   const totalVisitors = React.useMemo(() => {
//     return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
//   }, []);

//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Stats for this month</CardTitle>
//         <CardDescription>August - November 2024</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square max-h-[250px]"
//         >
//           <PieChart>
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Pie
//               data={chartData}
//               dataKey="visitors"
//               nameKey="browser"
//               innerRadius={60}
//               strokeWidth={5}
//             >
//               <Label
//                 content={({ viewBox }) => {
//                   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                     return (
//                       <text
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                       >
//                         <tspan
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           className="fill-foreground text-3xl font-bold"
//                         >
//                           {totalVisitors.toLocaleString()}
//                         </tspan>
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) + 24}
//                           className="fill-muted-foreground"
//                         >
//                           Visitors
//                         </tspan>
//                       </text>
//                     );
//                   }
//                 }}
//               />
//             </Pie>
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">
//         {/* <div className="flex items-center gap-2 font-medium leading-none">
//           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//         </div> */}
//         <div className="leading-none text-muted-foreground">
//           Showing total Candidates for the last 6 months
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// "use client";

// import React, { useMemo } from "react";
// import { Pie, PieChart, Label } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

/**
 * DynamicDonutChart: a reusable donut chart component
 * Props:
 *  - title: string (main heading)
 *  - subtitle: string (optional subheading)
 *  - data: array of { name, value, fill }
 *  - config: optional mapping { key: { label, color } }
 *  - centerLabelKey: string key in data objects to sum for center
 *  - centerLabelText: string label shown below center value
 */
// export default function DynamicDonutChart({
//   title,
//   subtitle,
//   data,
//   config,
//   centerLabelKey,
//   centerLabelText,
// }) {
//   const total = useMemo(
//     () => data.reduce((sum, item) => sum + (item[centerLabelKey] || 0), 0),
//     [data, centerLabelKey]
//   );

//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>{title}</CardTitle>
//         {subtitle && <CardDescription>{subtitle}</CardDescription>}
//       </CardHeader>

//       <CardContent className="flex-1 pb-0">
//         <ChartContainer
//           config={config}
//           className="mx-auto aspect-square max-h-[250px]"
//         >
//           <PieChart>
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Pie
//               data={data}
//               dataKey={centerLabelKey}
//               nameKey="name"
//               innerRadius={60}
//               strokeWidth={5}
//             >
//               <Label
//                 content={({ viewBox }) =>
//                   viewBox && "cx" in viewBox && "cy" in viewBox ? (
//                     <text
//                       x={viewBox.cx}
//                       y={viewBox.cy}
//                       textAnchor="middle"
//                       dominantBaseline="middle"
//                     >
//                       <tspan
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         className="fill-foreground text-3xl font-bold"
//                       >
//                         {total.toLocaleString()}
//                       </tspan>
//                       <tspan
//                         x={viewBox.cx}
//                         y={viewBox.cy + 24}
//                         className="fill-muted-foreground"
//                       >
//                         {centerLabelText}
//                       </tspan>
//                     </text>
//                   ) : null
//                 }
//               />
//             </Pie>
//           </PieChart>
//         </ChartContainer>
//       </CardContent>

//       <CardFooter className="text-sm">
//         <div className="leading-none text-muted-foreground">
//           {`Showing ${centerLabelText.toLowerCase()} for the selected period`}
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

"use client";

import React, { useMemo } from "react";
import { Pie, PieChart, Label } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

/**
 * DynamicDonutChart: a reusable donut chart component
 * Props:
 *  - title: string (main heading)
 *  - subtitle: string (optional subheading)
 *  - data: array of { name, value, fill }
 *  - config: optional mapping { key: { label, color } } (defaults to empty object)
 *  - centerLabelKey: string key in data objects to sum for center
 *  - centerLabelText: string label shown below center value
 */
export default function DynamicDonutChart({
  title,
  subtitle,
  data,
  config = {},
  centerLabelKey,
  centerLabelText,
}) {
  // Sum up the values for the center label
  const total = useMemo(
    () => data.reduce((sum, item) => sum + (item[centerLabelKey] || 0), 0),
    [data, centerLabelKey]
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {/* ensure config is always an object to avoid undefined */}
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={centerLabelKey}
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) =>
                  viewBox && "cx" in viewBox && "cy" in viewBox ? (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {total.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy + 24}
                        className="fill-muted-foreground"
                      >
                        {centerLabelText}
                      </tspan>
                    </text>
                  ) : null
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="text-sm">
        <div className="leading-none text-muted-foreground">
          {`Showing ${centerLabelText.toLowerCase()} for the selected period`}
        </div>
      </CardFooter>
    </Card>
  );
}
