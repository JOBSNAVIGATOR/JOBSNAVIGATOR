"use client";
import React, { useState } from "react";
import { BottomGradient } from "@/components/ui/BottomGradient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { makePutRequest } from "@/lib/apiRequest";
import { Settings2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { statusData } from "@/data";
import TextAreaInput from "../FormInputs/TextAreaInput";
import SelectInputThree from "../FormInputs/SelectInputThree";
import { useRouter } from "next/navigation";
export default function ChangeStatus({ candidateId, jobApplicantId, jobId }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const statusOptions = statusData;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  const router = useRouter();
  async function onSubmit(data) {
    data.jobApplicantId = jobApplicantId;
    data.candidateId = candidateId;
    data.jobId = jobId;
    // make put request (create)
    makePutRequest(setLoading, "api/updateStatus", data, "Status");
    setOpen(false);
  }
  return (
    <div className="flex items-center justify-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="bg-gradient-to-br relative group/btn from-blue-500 dark:from-lime-200 dark:to-lime-900 to-neutral-600 dark:bg-zinc-800  font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center gap-2 p-4">
            Change Status
            <Settings2 />
            <BottomGradient />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-slate-200  dark:bg-zinc-800 rounded-xl">
          <DialogHeader className="flex flex-col items-center justify-between gap-2">
            <DialogTitle className="mb-0 pb-0">
              <p className="text-xl font-bold">Change Status</p>
            </DialogTitle>
            <br />
          </DialogHeader>
          <DialogDescription></DialogDescription>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:shadow-emerald-500 sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto "
          >
            <div className="flex flex-col gap-4 mb-8">
              <SelectInputThree
                name="status"
                label="Status"
                register={register("status", { required: true })} // Ensure status is registered
                errors={errors}
                className="w-full"
                options={statusOptions}
              />
              <TextAreaInput
                label="Remarks"
                name="remarks"
                register={register}
                errors={errors}
                className="w-full"
                isRequired={false}
              />
            </div>
            {loading ? (
              <button
                disabled
                type="button"
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Updating Status
              </button>
            ) : (
              <button
                type="submit"
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              >
                Update Status
                <BottomGradient />
              </button>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
