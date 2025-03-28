"use client";
import React from "react";
import Heading from "@/components/backOffice/Heading";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";
import TagMasterTable from "./TagMasterTable";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  // const endpoint =
  //   userRole === "ADMIN"
  //     ? "/api/tags"
  //     : userRole === "CONSULTANT"
  //     ? `/api/tags?createdBy=${userId}`
  //     : null;
  // const { data, error } = useSWR(endpoint, fetcher, {
  const { data, error } = useSWR("/api/tags", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint
  if (status === "loading") {
    <div className="flex justify-center items-center h-screen">
      <AnimatedBoxes />
    </div>;
  }

  if (error) return <div>Error loading tags.</div>;
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <AnimatedBoxes />
      </div>
    );

  // console.log("hello", userId, userRole);

  return (
    <div>
      <div className="mt-4 py-4">
        {/* Header */}
        <Heading title="Tags" />
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/dashboard/tags/new">
          <button className="bg-gradient-to-br group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 text-center items-center shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
            Create Tag
          </button>
        </Link>
      </div>

      {/* table */}
      <div className="py-8">
        <TagMasterTable data={data} />
      </div>
    </div>
  );
}
