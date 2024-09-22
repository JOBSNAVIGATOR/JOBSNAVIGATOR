import CandidateForm from "@/components/frontOffice/CandidateForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function page({ params: { id } }) {
  const user = await getData(`users/${id}`);
  console.log(user);

  return (
    <div className="flex flex-col gap-6 p-16">
      <div className="max-w-4xl p-4 mx-auto">
        <h2 className="text-4xl">Hello {user?.name} Tell us More About Yourself</h2>
      </div>
      <CandidateForm user={user} />
    </div>
  );
}
