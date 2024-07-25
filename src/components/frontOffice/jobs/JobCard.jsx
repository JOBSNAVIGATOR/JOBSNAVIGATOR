"use client";
import React, { useState } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { BottomGradient } from "@/components/ui/BottomGradient";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from "@custom-react-hooks/use-media-query";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function JobCard({ jobItem }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="">
      <BackgroundGradient className="h-[300px] rounded-[22px] p-4  bg-white dark:bg-zinc-900 flex flex-col justify-around">
        <div className="flex flex-col justify-around h-[200px]">
          <p className="whitespace-nowrap text-wrap text-base sm:text-2xl text-black dark:text-neutral-200">
            {jobItem.jobTitle}
          </p>

          <p className="whitespace-nowrap text-wrap text-md text-neutral-600 dark:text-neutral-300">
            {jobItem.jobCompany}
          </p>
        </div>
        {isDesktop ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-700 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-center"
                // href={`/jobs/${jobItem.jobId}`}
              >
                View Details
                <BottomGradient />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-200  dark:bg-zinc-800 rounded-xl">
              <DialogHeader className="flex flex-col items-center justify-between gap-2">
                <Image
                  src="/bankLogo/dcbbank.jpeg"
                  alt="dcbbank"
                  height={100}
                  width={100}
                  className=""
                />
                <DialogTitle className="">{jobItem.jobTitle}</DialogTitle>
                <br />
              </DialogHeader>
              <DialogDescription>
                {/* job description */}
                <div className="flex mb-2">
                  <h2 className="flex w-40 justify-between">
                    <span>Job Description</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                  </h2>
                  <div className="flex-1">{jobItem.jobDescription}</div>
                </div>
                {/* job level */}
                <div className="flex mb-2">
                  <h2 className="flex w-40 justify-between">
                    <span>Level</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                  </h2>
                  <div className="flex-1">{jobItem.jobLevel}</div>
                </div>
                {/* job location */}
                <div className="flex mb-2">
                  <h2 className="flex w-40 justify-between">
                    <span>Location</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                  </h2>
                  <div className="flex-1">{jobItem.jobLocation}</div>
                </div>
                {/* CTC offered */}
                <div className="flex mb-2">
                  <h2 className="flex w-40 justify-between">
                    <span>CTC</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                  </h2>
                  <div className="flex-1">{jobItem.jobSalary} LPA</div>
                </div>
                {/* job Skills */}
                <div className="flex mb-2">
                  <h2 className="flex w-40 justify-between">
                    <span>Desired Skills</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                  </h2>
                  <div className="flex-1">
                    {jobItem.skillsRequired.join(", ")}
                  </div>
                </div>
              </DialogDescription>
              <DialogFooter className="pt-2">
                <DialogClose asChild>
                  <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-700 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-center"
                    // href={`/jobs/${jobItem.jobId}`}
                  >
                    Apply
                    <BottomGradient />
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-700 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-center"
                // href={`/jobs/${jobItem.jobId}`}
              >
                View Details
                <BottomGradient />
              </button>
            </DrawerTrigger>
            <DrawerContent className=" bg-slate-200  dark:bg-zinc-800 rounded-xl">
              <DrawerHeader className="text-left flex items-center gap-2 justify-between">
                <DrawerTitle>{jobItem.jobTitle}</DrawerTitle>
                <Image
                  src="/bankLogo/dcbbank.jpeg"
                  alt="dcbbank"
                  height={100}
                  width={100}
                  className=""
                />
              </DrawerHeader>
              <DrawerDescription className="px-8">
                {/* job description */}
                <div className="flex mb-2">
                  <h2 className="flex w-40 justify-between">
                    <span>Job Description</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                  </h2>
                  <div className="flex-1">{jobItem.jobDescription}</div>
                </div>
                {/* job level */}
                <div className="flex mb-2">
                  <h2 className="flex w-40 justify-between">
                    <span>Level</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                  </h2>
                  <div className="flex-1">{jobItem.jobLevel}</div>
                </div>
                {/* job location */}
                <div className="flex mb-2">
                  <h2 className="flex w-40 justify-between">
                    <span>Location</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                  </h2>
                  <div className="flex-1">{jobItem.jobLocation}</div>
                </div>
                {/* job Skills */}
                <div className="flex mb-2">
                  <h2 className="flex w-40 justify-between">
                    <span>Desired Skills</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                  </h2>
                  <div className="flex-1">
                    {jobItem.skillsRequired.join(", ")}
                  </div>
                </div>
              </DrawerDescription>
              <DrawerFooter className="pt-2">
                <DrawerClose asChild>
                  <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-700 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-center"
                    // href={`/jobs/${jobItem.jobId}`}
                  >
                    Apply
                    <BottomGradient />
                  </button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </BackgroundGradient>
    </div>
  );
}
