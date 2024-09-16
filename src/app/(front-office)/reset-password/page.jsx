import ResetPasswordForm from "@/components/frontOffice/ResetPasswordForm";
import React from "react";

export default function page() {
  return (
    <section className="bg-slate-300 dark:bg-gray-800">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div className=" w-full bg-slate-100 dark:shadow-blue-400 rounded-xl shadow-2xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl  text-center text-neutral-800 dark:text-neutral-200">
              Reset Password
            </h1>
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </section>
  );
}
