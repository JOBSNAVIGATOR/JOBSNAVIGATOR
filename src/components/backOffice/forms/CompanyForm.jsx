"use client";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextAreaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
// import { makePostRequest, makePutRequest } from "@/lib/apiRequest";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function CompanyForm({ updateData = {} }) {
  // console.log("updateData", updateData);
  const id = updateData?.id ?? "";
  const initialCompanyLogo = updateData?.companyLogo ?? "";
  const [companyLogo, setCompanyLogo] = useState(initialCompanyLogo); // Image Base64 state
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
      ...updateData,
      companyName: updateData?.companyName ? updateData?.companyName : "",
      companyDescription: updateData?.companyDescription
        ? updateData?.companyDescription
        : "",
    },
  });

  const handleRemoveImage = () => {
    setCompanyLogo(""); // Clear the resume state when the resume is removed
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      // Check if the file is an image
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG, PNG, GIF).");
        return;
      }

      // Check if the file size exceeds a limit (e.g., 2MB)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        alert("File size exceeds 2MB limit.");
        return;
      }

      const reader = new FileReader(); // Create FileReader

      // Set the callback for when file reading is finished
      reader.onloadend = () => {
        setCompanyLogo(reader.result); // Save the base64 string in state
      };

      reader.onerror = () => {
        alert("Error reading the file. Please try again.");
      };

      reader.readAsDataURL(file); // Start reading the file
    }
  };

  async function onSubmit(data) {
    try {
      if (id) {
        // console.log("updateddddd", data);
        const payload = {
          ...data,
          companyLogo, // Include Base64-encoded image
        };
        // console.log("payload", payload); // Check the final payload in the console
        // make put request (update)
        makePutRequest(
          setLoading,
          `api/companies/${id}`,
          payload,
          "Company",
          reset
        );
        router.back();
        // console.log("Update Request:", data);
      } else {
        // console.log("POst Data", data);
        // make post request (create)
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
        />
        <TextAreaInput
          label="Company Description"
          name="companyDescription"
          register={register}
          errors={errors}
        />

        {/* Display existing resume with option to remove */}
        {companyLogo && (
          <div className="mb-4">
            <a
              href={companyLogo}
              download="companyLogo.jpeg"
              className="text-blue-600 underline text-xl"
            >
              View Uploaded Image
            </a>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="ml-4 text-red-500 text-xl"
            >
              Remove
            </button>
          </div>
        )}

        {!companyLogo && (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Company Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload} // Handle image file change
              className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            {companyLogo && (
              <p className="text-sm text-green-600 mt-2">
                Image is ready to be uploaded
              </p>
            )}
          </div>
        )}

        {/* <div className="col-span-2">
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
        </div> */}
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
