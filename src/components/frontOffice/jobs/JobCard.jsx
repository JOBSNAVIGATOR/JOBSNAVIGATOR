"use client";
import React, { useState } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { BottomGradient } from "@/components/ui/BottomGradient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useMediaQuery } from "@custom-react-hooks/use-media-query";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";
import { makePostRequest } from "@/lib/apiRequest";

export default function JobCard({ jobItem }) {
  // useSWR should always be called at the top level of your component
  const { data: job, error } = useSWR(`/api/jobs/${jobItem.id}`, fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  });

  const [open, setOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();
  if (status === "loading") {
    // <Loading />;
    <div className="flex justify-center items-center h-screen">
      <AnimatedBoxes />
    </div>;
  }
  // const userId = session?.user?.id;
  // console.log(userId);

  const handleApply = async () => {
    try {
      // console.log("check1");
      if (status === "authenticated") {
        // console.log("check2");
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(`${baseUrl}/api/jobApplicant`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId: jobItem.id,
            userId: session?.user?.id,
          }), // Adjust payload as needed
          // body: JSON.stringify(data),
        });
        // console.log("check3");
        const responseData = await response.json();
        setLoading(false);
        if (response.ok) {
          toast.success("You have Successfully Applied to this Job");
          setIsApplied(true);
          setOpen(false);
        } else {
          if (response.status === 400) {
            toast.error("You have already applied to this job");
          } else {
            // Handle other errors
            // console.error("Server Error:", responseData.message);
            toast.error("Oops Something Went wrong");
          }
        }
      } else {
        toast.error("You need to be Logged in to Apply to Jobs ");
        setOpen(false);
        router.push("/login");
      }
    } catch (error) {
      setLoading(false);
      // console.error("Network Error:", error);
      toast.error("Its seems something is wrong with your Network");
    }
  };

  return (
    <div className="">
      <BackgroundGradient className="h-[300px] rounded-[22px] p-4  bg-white dark:bg-zinc-900 flex flex-col justify-around">
        {/* Job Summary with title and company */}
        <div className="flex flex-col justify-around h-[200px]">
          <p className="whitespace-nowrap text-wrap text-base sm:text-2xl text-black dark:text-neutral-200">
            {jobItem.jobTitle}
          </p>

          <p className="whitespace-nowrap text-wrap text-md text-neutral-600 dark:text-neutral-300">
            {job?.jobCompany?.companyName}
          </p>
        </div>
        {/* if desktop then on click view details dialog will appear with job details else drawer will popup with job details */}
        {isDesktop ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-700 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-center"
                // disabled={isApplied}
                // href={`/jobs/${jobItem.jobId}`}
              >
                {/* {isApplied ? "Applied" : "View Details"} */}
                View Details
                <BottomGradient />
              </button>
            </DialogTrigger>
            {/* job details */}
            <DialogContent className="sm:max-w-[425px] bg-slate-200  dark:bg-zinc-800 rounded-xl">
              <DialogHeader className="flex flex-col items-center justify-between gap-2">
                <Image
                  // src={jobItem.companyImage}
                  src={job?.jobCompany?.companyLogo}
                  alt={job?.jobCompany?.companyName}
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
                {/* job Sector */}
                <div className="flex mb-2">
                  <h2 className="flex w-40 justify-between">
                    <span>Sector</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                  </h2>
                  <div className="flex-1">{jobItem.sector.sectorName}</div>
                </div>
                {/* job Domain */}
                <div className="flex mb-2">
                  <h2 className="flex w-40 justify-between">
                    <span>Domain</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                  </h2>
                  <div className="flex-1">{jobItem.domain.name}</div>
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
                {/* <div className="flex mb-2">
                  <h2 className="flex w-40 justify-between">
                    <span>Desired Skills</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                  </h2>
                  <div className="flex-1">
                    {jobItem.skillsRequired.join(", ")}
                  </div>
                </div> */}
                {/* job Skills */}
                {jobItem.skillsRequired.length > 0 && (
                  <div className="flex mb-2">
                    <h2 className="flex w-40 justify-between">
                      <span>Desired Skills</span>
                      <ArrowRight className="h-4 w-4 mx-2" />
                    </h2>
                    <div className="flex-1">
                      {jobItem.skillsRequired.join(", ")}
                    </div>
                  </div>
                )}
              </DialogDescription>
              <DialogFooter className="pt-2">
                {/* a confirmation dialog */}
                <AlertDialog>
                  <AlertDialogTrigger
                    disabled={isApplied}
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-700 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-center"
                  >
                    {isApplied ? "Applied" : "Apply"}
                  </AlertDialogTrigger>
                  <div className="text-right mt-2">
                    <p className="text-sm text-gray-500">
                      Powered By JOBSNAVIGATOR
                    </p>
                  </div>

                  <AlertDialogContent className="sm:max-w-[425px] bg-slate-200  dark:bg-zinc-800 rounded-xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Do you match the required Skill set?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-700 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-center">
                        Cancel
                        <BottomGradient />
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleApply}
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-700 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-center"
                      >
                        Apply
                        <BottomGradient />
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-700 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-center"
                // disabled={isApplied}
              >
                {/* {isApplied ? "Applied" : "View Details"} */}
                View Details
                <BottomGradient />
              </button>
            </DrawerTrigger>
            {/* job details */}
            <DrawerContent className="sm:max-w-[425px] bg-slate-200  dark:bg-zinc-800 rounded-xl">
              <DrawerHeader className="flex flex-col items-center justify-between gap-2">
                <Image
                  src="/bankLogo/dcbbank.jpeg"
                  alt="dcbbank"
                  height={100}
                  width={100}
                  className=""
                />
                <DrawerTitle className="">{jobItem.jobTitle}</DrawerTitle>
                <br />
              </DrawerHeader>
              <DrawerDescription>
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
              </DrawerDescription>
              <DrawerFooter className="pt-2">
                {/* a confirmation dialog */}
                <AlertDialog>
                  <AlertDialogTrigger
                    disabled={isApplied}
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-700 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-center"
                  >
                    {isApplied ? "Applied" : "Apply"}
                  </AlertDialogTrigger>
                  <div className="text-right mt-2">
                    <p className="text-sm text-gray-500">
                      Powered By JOBSNAVIGATOR
                    </p>
                  </div>
                  <AlertDialogContent className="sm:max-w-[425px] bg-slate-200  dark:bg-zinc-800 rounded-xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Do you match the required Skill set?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-700 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-center">
                        Cancel
                        <BottomGradient />
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleApply}
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-700 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-center"
                      >
                        Apply
                        <BottomGradient />
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </BackgroundGradient>
    </div>
  );
}
