"use client";
import React, { useEffect, useMemo, useState } from "react";
import { BottomGradient } from "../ui/BottomGradient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Briefcase } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import MultiSelectInput from "../FormInputs/MultiSelectInput";
import { useForm } from "react-hook-form";
import SubmitButton from "../FormInputs/SubmitButton";
import { makePostRequest } from "@/lib/apiRequest";

export default function AssignJobToConsultantButton({ consultant }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: jobs, error } = useSWR("/api/jobs", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  const {
    register,
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...consultant,
    },
  });

  // Format jobs into desired structure
  const formattedJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.map((job) => ({
      label: job.jobCode, // Job Code as label
      value: job.id, // Job ID as value
    }));
  }, [jobs]);
  console.log("jobs", formattedJobs);
  async function onSubmit(data) {
    console.log("data", data);

    makePostRequest(
      setLoading,
      "api/assignJobToConsultant",
      data,
      "Assignment of Job to Consultant ",
      reset
    );
    setOpen(false);
  }
  return (
    <div className="sm:col-span-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center gap-2">
            <Briefcase />
            Assign Job to Consultant
            <BottomGradient />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px] bg-slate-200  dark:bg-zinc-800 rounded-xl">
          <DialogHeader className="flex flex-col items-center justify-between gap-2">
            <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
              <Briefcase />
              Select the Jobs :{" "}
            </DialogTitle>
            <br />
          </DialogHeader>
          {/* <DialogDescription> */}
          <div className="flex flex-col gap-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <MultiSelectInput
                label="Jobs"
                name="jobs"
                register={register}
                errors={errors}
                className="w-full"
                options={formattedJobs}
                watch={watch}
                setValue={setValue}
              />

              <SubmitButton
                isLoading={loading}
                buttonTitle="Assign Job"
                loadingButtonTitle="Assigning Job Please wait ..."
              />
            </form>
          </div>
          {/* </DialogDescription> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
