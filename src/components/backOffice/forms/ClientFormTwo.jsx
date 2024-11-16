"use client";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextInput from "@/components/FormInputs/TextInput";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { domainsData, genderData, sectorsData } from "@/data";
import SelectInputThree from "@/components/FormInputs/SelectInputThree";

export default function ClientFormTwo({ updateData = {} }) {
  const id = updateData?.candidateProfile?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...updateData.candidateProfile,
    },
  });

  const genderOptions = genderData;
  const sectorOptions = sectorsData;
  const domainOptions = domainsData;

  async function onSubmit(data) {
    console.log(data);

    // make post request (create)
    makePostRequest(
      setLoading,
      "api/candidates",
      data,
      "Candidate Profile",
      reset
    );
    // setPdfUrl("");
    router.push("/");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:shadow-emerald-500 sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput
          label="Full Name"
          name="name"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Email Address"
          name="email"
          type="email"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Contact Number"
          name="contactNumber"
          type="tel"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Alternate Contact Number"
          name="emergencyContactNumber"
          type="tel"
          register={register}
          errors={errors}
          className="w-full"
          isRequired={false}
        />
        <SelectInputThree
          label="Gender"
          name="gender"
          // register={register}
          register={register("gender", { required: true })} // Ensure gender is registered
          errors={errors}
          className="w-full"
          options={genderOptions}
        />
        <SelectInputThree
          label="Sector"
          name="sector"
          // register={register}
          register={register("sector", { required: true })} // Ensure gender is registered
          errors={errors}
          className="w-full"
          options={sectorOptions}
        />
        <SelectInputThree
          label="Domain"
          name="domain"
          // register={register}
          register={register("domain", { required: true })} // Ensure gender is registered
          errors={errors}
          className="w-full"
          options={domainOptions}
        />
        <TextInput
          label="Current Company"
          name="currentCompany"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Designation"
          name="designation"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Current Job Location"
          name="currentJobLocation"
          register={register}
          errors={errors}
          className="w-full"
        />
        <br />
        <br />
        <br />
      </div>

      <SubmitButton
        isLoading={loading}
        buttonTitle={id ? "Update Profile" : "Create Profile "}
        loadingButtonTitle={`${
          id ? "Updating" : "Creating"
        } Profile Please wait ...`}
      />
    </form>
  );
}
