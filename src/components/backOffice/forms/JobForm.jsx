"use client";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SelectInput from "@/components/FormInputs/SelectInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextAreaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import { domainsData, sectorsData } from "@/data";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
import { fetcher } from "@/lib/fetcher";
import { data } from "autoprefixer";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

export default function JobForm({ updateData = {} }) {
  const initialSkills = updateData?.skillsRequired ?? [];
  const id = updateData?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { data: companies, error } = useSWR("/api/companies", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  const { data: clients, errorClients } = useSWR("/api/clients", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  // Transform companies data for SelectInput
  const companyOptions = companies
    ? companies.map((company) => ({
        value: company.id, // Assuming 'id' is the unique identifier
        label: company.companyName, // Use 'companyName' as the label
      }))
    : [];

  // Transform companies data for SelectInput
  const clientOptions = clients
    ? clients.map((client) => ({
        value: client.id, // Assuming 'id' is the unique identifier
        label: client.name, // Use 'companyName' as the label
      }))
    : [];

  const { data: session, status } = useSession();
  if (status === "loading") {
    // <Loading />;
    <p>loading...</p>;
  }
  // const user = session?.user;

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...updateData,
      isActive: true,
    },
  });
  const isActive = watch("isActive");

  const [skillsRequired, setSkillsRequired] = useState(initialSkills);

  const sectors = sectorsData;
  const domains = domainsData;

  async function onSubmit(data) {
    data.skillsRequired = skillsRequired;
    data.postedBy = session?.user?.id;
    // console.log(data);
    // Handle form submission logic
    if (id) {
      // console.log("1");
      // console.log(data);
      // make put request (update)
      makePutRequest(setLoading, `api/jobs/${id}`, data, "Job", reset);
      router.back();
      // console.log("Update Request:", data);
    } else {
      // make post request (create)
      console.log("2", data);
      makePostRequest(setLoading, "api/jobs", data, "Jobs", reset);
      // router.back();
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:shadow-emerald-500 sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput
          label="Title"
          type="text"
          name="jobTitle"
          register={register}
          errors={errors}
          className="w-full"
        />
        <SelectInput
          label="Select Company"
          name="jobCompany"
          register={register}
          errors={errors}
          className="w-full"
          options={companyOptions || []}
        />
        <TextAreaInput
          label="Job Description"
          name="jobDescription"
          register={register}
          errors={errors}
        />
        <SelectInput
          label="Sector"
          name="jobSector"
          register={register}
          errors={errors}
          className="w-full"
          options={sectors}
        />

        <SelectInput
          label="Domain"
          name="jobDomain"
          register={register}
          errors={errors}
          className="w-full"
          options={domains}
        />

        <SelectInput
          label="Client SPOC"
          name="clientId"
          register={register}
          errors={errors}
          className="w-full"
          options={clientOptions || []}
        />

        <TextInput
          label="Total Vacancies"
          type="number"
          name="jobVacancies"
          register={register}
          errors={errors}
          className="w-full"
          placeholder="Positions"
        />
        <TextInput
          label="Remaining Vacancies"
          type="number"
          name="jobVacanciesRemaining"
          register={register}
          errors={errors}
          className="w-full"
          placeholder="Positions Remaining"
        />
        <TextInput
          label="Location"
          type="text"
          name="jobLocation"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="CTC"
          type="text"
          name="jobSalary"
          register={register}
          errors={errors}
          className="w-full"
        />

        <ArrayItemsInput
          items={skillsRequired}
          setItems={setSkillsRequired}
          itemTitle="Skills Required"
        />
        <ToggleInput
          label="Is Active ?"
          name="isActive"
          trueTitle="Active"
          falseTitle="Expired"
          register={register}
        />
      </div>
      <br />

      <SubmitButton
        isLoading={loading}
        buttonTitle={id ? "Update Job" : "Create Job"}
        loadingButtonTitle={`${
          id ? "Updating" : "Creating"
        } Job Please wait ...`}
      />
    </form>
  );
}
