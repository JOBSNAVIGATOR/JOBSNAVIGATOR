"use client";
import SelectInput from "@/components/FormInputs/SelectInput";
// import ImageInput from "@/components/FormInputs/ImageInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextInput from "@/components/FormInputs/TextInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import { makePostRequest } from "@/lib/apiRequest";
import { generateNormalDate } from "@/lib/generateNormalDate";
// import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
// import { generateUserCode } from "@/lib/generateUserCode";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function ConsultantForm({ user, updateData = {} }) {
  const id = updateData?.consultantProfile?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const joiningDate = updateData?.consultantProfile?.joiningDate
    ? new Date(updateData.consultantProfile.joiningDate)
        .toISOString()
        .split("T")[0] // Convert to YYYY-MM-DD format
    : ""; // Use empty string if no joining date exists

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
      joiningDate,
      ...user,
      ...updateData.consultantProfile,
    },
  });

  const isActive = watch("isActive");

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
  ];

  async function onSubmit(data) {
    if (id) {
      // make put request (update)
      console.log(id);
      // data.userId = updateData?.id;
      // makePutRequest(
      //   setLoading,
      //   `api/farmers/${id}`,
      //   data,
      //   "Farmer Profile",
      //   reset
      // );
      // setImageUrl("");
      // router.back();
      // console.log("Update Request:", data);
    } else {
      // make post request (create)
      data.role = "CONSULTANT";
      console.log("POst Data", data);
      makePostRequest(
        setLoading,
        "api/consultants",
        data,
        "Consultant Profile",
        reset
      );
      router.back();
    }
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
          disabled={!!id} // Disable if updating
        />
        <TextInput
          label="Contact Number"
          name="contactNumber"
          type="tel"
          register={register}
          errors={errors}
          className="w-full"
          disabled={!!id} // Disable if updating
        />
        <TextInput
          label="Emergency Contact Number"
          name="emergencyContactNumber"
          type="tel"
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
          disabled={!!id} // Disable if updating
        />
        <SelectInput
          label="Gender"
          name="gender"
          // register={register}
          register={register("gender", { required: true })} // Ensure gender is registered
          errors={errors}
          className="w-full"
          options={genderOptions}
        />
        <TextInput
          label="Permanent Address"
          name="permanentAddress"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Current Address"
          name="currentAddress"
          register={register}
          errors={errors}
          className="w-full"
        />
        {/* <TextInput
          label="Aadhar Number"
          name="aadharNumber"
          register={register}
          errors={errors}
          className="w-full"
          type="number"
          disabled={!!id} // Disable if updating
        />
        <TextInput
          label="CTC Offered"
          name="ctcOffered"
          register={register}
          errors={errors}
          className="w-full"
        /> */}
        {/* <TextInput
          label="Joining Date"
          name="joiningDate"
          register={register}
          errors={errors}
          className="w-full"
          type="date"
        /> */}

        {id ? (
          <div className="flex flex-col space-y-2 w-full">
            <label className="block text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  mb-2 text-md ">
              Joining Date
            </label>
            <span
              className="flex h-10 w-full border-none bg-gray-300 dark:bg-zinc-600 text-black dark:text-white shadow-input rounded-xl px-3 py-2 text-sm file:border-0 file:bg-transparent
                    file:text-sm file:font-medium dark:placeholder:text-neutral-300 dark:placeholder-text-neutral-600 
                    focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
                    group-hover/input:shadow-none transition duration-400"
            >
              {joiningDate}
            </span>
          </div>
        ) : (
          <TextInput
            label="Joining Date"
            name="joiningDate"
            register={register}
            errors={errors}
            className="w-full"
            type="date"
          />
        )}

        <ToggleInput
          label="Currently Working"
          name="isActive"
          trueTitle="Active"
          falseTitle="Draft"
          register={register}
        />
      </div>
      <br />
      <br />
      <br />

      <SubmitButton
        isLoading={loading}
        buttonTitle={id ? "Update Consultant" : "Create Consultant"}
        loadingButtonTitle={`${
          id ? "Updating" : "Creating"
        } Consultant Please wait ...`}
      />
    </form>
  );
}
