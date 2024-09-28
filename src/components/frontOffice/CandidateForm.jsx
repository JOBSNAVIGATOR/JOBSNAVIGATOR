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
import { generateCandidateCode } from "@/lib/generateCandidateCode";
import { useEffect } from "react";
import { getData } from "@/lib/getData";
// import ImageInput from "../FormInputs/ImageInput";

export default function CandidateForm({ user, updateData = {} }) {
  const initialResumeUrl = updateData?.candidateProfile?.resume ?? "";
  // const initialProducts = updateData?.farmerProfile?.products ?? [];
  const initialSkills = updateData?.candidateProfile?.skills ?? [];
  const id = updateData?.candidateProfile?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(initialSkills);
  const [resume, setResume] = useState(initialResumeUrl); // State for resume upload
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

  // Fetch candidate data if updating
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await getData(`candidateProfile/${id}`);
          const candidateData = response.data; // Assuming response structure
          reset(candidateData); // Populate the form with fetched data
        } catch (error) {
          console.error("Error fetching candidate data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      reset({ ...user }); // Reset to user data if no id
    }
  }, [id, reset, user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Get Base64 string without prefix
        setResume(base64String); // Update state with Base64 string
      };

      reader.readAsDataURL(file);
    } else {
      // Handle case where no file is selected
      console.log("No file selected.");
      setResume(""); // Clear the resume state if no file is selected
    }
  };

  async function onSubmit(data) {
    data.resume = resume;
    data.skills = skills;
    if (id) {
      // make put request (update)
      console.log(id);
      data.candidateProfileId = updateData?.id;
      makePutRequest(
        setLoading,
        `api/farmers/${id}`,
        data,
        "Farmer Profile",
        reset
      );
      setPdfUrl("");
      router.back();
      console.log("Update Request:", data);
    } else {
      // make post request (create)
      console.log("2");
      data.userId = user.id;
      console.log("Candidate Formdat", data);
      makePostRequest(
        setLoading,
        "api/onboarding",
        data,
        "Candidate Profile"
        // reset
      );
      // setPdfUrl("");
      // router.push("/");
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
          // register={register}
          register={register("gender", { required: true })} // Ensure gender is registered
          errors={errors}
          className="w-full"
          options={genderOptions}
        />
        <TextInput
          label="Sector"
          name="sector"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Domain"
          name="domain"
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
          label="Current Company"
          name="currentCompany"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Previous Companies (Separated by Comma)"
          name="previousCompanyName"
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
        <TextInput
          label="Total Working Experience (Yrs)"
          name="totalWorkingExperience"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Current CTC"
          name="currentCtc"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Degree"
          name="degree"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="College Name"
          name="collegeName"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Graduation Year"
          name="graduationYear"
          register={register}
          errors={errors}
          className="w-full"
        />
        <ArrayItemsInput
          itemTitle="Skills"
          items={skills}
          setItems={setSkills}
          defaultValues={updateData?.candidateProfile?.skills}
        />
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
            onChange={handleFileChange} // Update state with selected file
            className="block w-full text-gray-900 dark:text-gray-200 border rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-lime-700"
            required // Optional: make it required
          />
          {errors.resume && (
            <small className="text-sm text-red-600">Resume is required</small>
          )}
        </div>

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
