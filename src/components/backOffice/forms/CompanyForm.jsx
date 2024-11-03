"use client";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextAreaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import { makePostRequest } from "@/lib/apiRequest";
// import { makePostRequest, makePutRequest } from "@/lib/apiRequest";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function CompanyForm({ updateData = {} }) {
  const id = updateData?.company?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  // Function to convert file to base64
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  async function onSubmit(data) {
    try {
      const file = watch("companyLogo")[0]; // Get the selected file
      if (file) {
        const base64Logo = await convertToBase64(file); // Convert file to base64
        data.companyLogo = base64Logo; // Add base64 string to form data
      }
      if (id) {
        // make put request (update)
        // console.log(id);
        // data.userId = updateData?.id;
        // makePutRequest(
        //   setLoading,
        //   `api/company/${id}`,
        //   data,
        //   "Company",
        //   reset
        // );
        // setImageUrl("");
        // router.back();
        // console.log("Update Request:", data);
      } else {
        // make post request (create)
        // console.log("POst Data", data);
        makePostRequest(setLoading, "api/companies", data, "Company", reset);
        router.back();
      }
    } catch (error) {
      // console.error("Error converting image to base64:", error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:shadow-emerald-500 sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput
          label="Company Name"
          name="companyName"
          register={register}
          errors={errors}
          className="w-full"
          disabled={!!id} // Disable if updating
        />
        <TextAreaInput
          label="Company Description"
          name="companyDescription"
          register={register}
          errors={errors}
        />
        <div className="col-span-2">
          <label
            htmlFor="companyLogo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Company Logo
          </label>
          <input
            type="file"
            id="companyLogo"
            accept="image/*"
            {...register("companyLogo", { required: !id })}
            className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          {errors.companyLogo && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {errors.companyLogo.message}
            </p>
          )}
        </div>
      </div>
      <br />
      <br />
      <br />

      <SubmitButton
        isLoading={loading}
        buttonTitle={id ? "Update Company" : "Create Company"}
        loadingButtonTitle={`${
          id ? "Updating" : "Creating"
        } Company Please wait ...`}
      />
    </form>
  );
}
