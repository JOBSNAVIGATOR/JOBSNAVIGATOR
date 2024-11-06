// "use client";
// import PageHeader from "@/components/backOffice/PageHeader";
// import React from "react";
// import { companiesData } from "@/data";
// import DataTable from "@/components/data-table-components/DataTable";
// import { columns } from "./columns";
// import DownloadExcel from "@/components/backOffice/DownloadCsv";
// import useSWR from "swr";
// import { fetcher } from "@/lib/fetcher";

// export default function page() {
//   const { data, error } = useSWR("/api/companies", fetcher, {
//     refreshInterval: 5000, // refetch data every 5 seconds
//   }); // replace with your API endpoint

//   if (error) return <div>Error loading candidates.</div>;
//   if (!data) return <div>Loading...</div>;
//   console.log(data);
//   return (
//     <div>
//       {/* Header */}
//       <PageHeader
//         heading={"Companies"}
//         href={"/dashboard/clientCompanies/new"}
//         linkTitle={"Add Company"}
//       />

//       {/* <div className="flex justify-end">
//         <DownloadExcel data={companiesData} fileName="companies.xlsx" />
//       </div> */}

//       {/* table */}
//       <div className="py-8">
//         <DataTable data={companiesData} columns={columns} />
//       </div>
//     </div>
//   );
// }

"use client";
import React from "react";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import Heading from "@/components/backOffice/Heading";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import DownloadCSV from "@/components/backOffice/DownloadCsv";
import PageHeader from "@/components/backOffice/PageHeader";

export default function Page() {
  // const jobs = await getData("jobs");

  const { data, error } = useSWR("/api/companies", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  if (error) return <div>Error loading companies.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {/* Header */}
      <PageHeader
        heading={"Companies"}
        href={"/dashboard/clientCompanies/new"}
        linkTitle={"Add Company"}
      />

      {/* <div className="flex justify-end">
        <DownloadExcel data={companiesData} fileName="companies.xlsx" />
      </div> */}

      {/* table */}
      <div className="py-8">
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}
