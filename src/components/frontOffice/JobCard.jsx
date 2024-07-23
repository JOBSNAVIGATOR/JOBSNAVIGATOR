"use client";
import React from "react";
import { BackgroundGradient } from "../ui/background-gradient";
import Link from "next/link";
import { BottomGradient } from "../ui/BottomGradient";

export default function JobCard({ jobItem }) {
  return (
    <div className="">
      <BackgroundGradient className="h-[300px] rounded-[22px] p-4 sm:p-10 bg-white dark:bg-zinc-900 flex flex-col justify-around">
        <div className="flex flex-col justify-around h-[200px]">
          <p className="whitespace-nowrap text-wrap text-base sm:text-2xl text-black mt-4 mb-2 dark:text-neutral-200">
            {jobItem.jobTitle}
          </p>

          <p className="whitespace-nowrap text-wrap text-sm text-neutral-600 dark:text-neutral-400">
            {jobItem.jobCompany}
          </p>
        </div>
        <Link
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-center pt-1"
          href={`/jobs/${jobItem.id}`}
        >
          View Details
          <BottomGradient />
        </Link>
      </BackgroundGradient>
    </div>
  );
}
