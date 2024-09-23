"use client";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextInput from "@/components/FormInputs/TextInput";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ArrayItemsInput from "../FormInputs/ArrayItemsInput";
import SelectInput from "../FormInputs/SelectInput";
import ToggleInput from "../FormInputs/ToggleInput";
// import ImageInput from "../FormInputs/ImageInput";

export default function CandidateForm({ user, updateData = {} }) {
  const initialImageUrl = updateData?.farmerProfile?.profileImageUrl ?? "";
  // const initialProducts = updateData?.farmerProfile?.products ?? [];
  const initialSkills = updateData?.candidateProfile?.skills ?? [];
  const id = updateData?.farmerProfile?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(initialImageUrl);
  const [skills, setSkills] = useState(initialSkills);
  const [resume, setResume] = useState(null); // State for resume upload
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...user,
      ...updateData.candidateProfile,
    },
  });

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
  ];

  async function onSubmit(data) {
    data.resume = resume;
    console.log("Candidate Formdat", data);

    // data.products = products;
    // data.pdfUrl = pdfUrl;
    // console.log(data);
    // if (id) {
    //   // make put request (update)
    //   console.log(id);
    //   data.userId = updateData?.id;
    //   makePutRequest(
    //     setLoading,
    //     `api/farmers/${id}`,
    //     data,
    //     "Farmer Profile",
    //     reset
    //   );
    //   setPdfUrl("");
    //   router.back();
    //   console.log("Update Request:", data);
    // } else {
    //   // make post request (create)
    //   console.log("2");
    //   data.userId = user.id;
    //   makePostRequest(setLoading, "api/farmers", data, "Farmer Profile", reset);
    //   setPdfUrl("");
    //   router.push("/login");
    // }
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
          disabled // Make this field non-editable
        />
        <TextInput
          label="Email Address"
          name="email"
          type="email"
          register={register}
          errors={errors}
          className="w-full"
          disabled // Make this field non-editable
        />
        <TextInput
          label="Contact Number"
          name="contactNumber"
          type="tel"
          register={register}
          errors={errors}
          className="w-full"
          disabled // Make this field non-editable
        />
        <TextInput
          label="Emergency Contact Number"
          name="emergencyContactNumber"
          type="tel"
          register={register}
          errors={errors}
          className="w-full"
        />
        <SelectInput
          label="Gender"
          name="gender"
          register={register}
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
        <TextInput
          label="Aadhar Number"
          name="aadharNumber"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="CTC"
          name="ctcOffered"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Joining Date"
          name="joiningDate"
          register={register}
          errors={errors}
          className="w-full"
          type="date"
        />
        {/* <ImageInput
          label="Your Resume"
          pdfUrl={pdfUrl}
          setPdfUrl={setPdfUrl}
          endpoint="categoryImageUploader"
        /> */}

        <div className="sm:col-span-2">
          <label
            className="block mb-2 text-md font-medium text-neutral-800 dark:text-neutral-200"
            htmlFor="resume"
          >
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            id="resume"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])} // Update state with selected file
            className="block w-full text-gray-900 dark:text-gray-200 border rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-lime-700"
            required // Optional: make it required
          />
          {errors.resume && (
            <small className="text-sm text-red-600">Resume is required</small>
          )}
        </div>

        <ArrayItemsInput
          itemTitle="Skills"
          items={skills}
          setItems={setSkills}
          defaultValues={updateData?.candidateProfile?.skills}
        />
        <br />
        <br />
        <br />
      </div>

      <SubmitButton
        isLoading={loading}
        buttonTitle={id ? "Update Profile" : "Update Profile "}
        loadingButtonTitle={`${
          id ? "Updating" : "Updating"
        } Profile Please wait ...`}
      />
    </form>
  );
}
