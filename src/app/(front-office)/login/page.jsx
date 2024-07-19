import LoginForm from "@/components/frontOffice/LoginForm";
import React from "react";

export default function page() {
  return (
    <section className="bg-slate-300 dark:bg-gray-800">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div className="w-full bg-slate-100 dark:shadow-blue-400 rounded-lg shadow-2xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Login To your Account
            </h1>
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}
