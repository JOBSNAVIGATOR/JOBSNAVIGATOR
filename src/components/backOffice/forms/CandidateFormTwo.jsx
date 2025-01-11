"use client";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextInput from "@/components/FormInputs/TextInput";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { domainsData, sectorsData } from "@/data";
import { degrees, PDFDocument, rgb } from "pdf-lib";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SelectInputThree from "@/components/FormInputs/SelectInputThree";

export default function CandidateFormTwo({ updateData = {} }) {
  const initialResumeUrl = updateData?.candidateProfile?.resume ?? "";
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
      ...updateData.candidateProfile,
    },
  });

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
  ];

  const sectorOptions = sectorsData;
  const domainOptions = domainsData;

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
      // console.log("No file selected.");
      setResume(""); // Clear the resume state if no file is selected
    }
  };

  const handleRemoveResume = () => {
    setResume(""); // Clear the resume state when the resume is removed
  };

  function convertUint8ArrayToBase64(uint8Array) {
    const chunkSize = 1024; // Adjust based on your needs
    let binaryString = "";

    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      binaryString += String.fromCharCode.apply(null, chunk);
    }

    return btoa(binaryString);
  }

  async function addWatermarkToPdf(base64Pdf) {
    // Decode base64 string to bytes
    const pdfBytes = Uint8Array.from(atob(base64Pdf), (c) => c.charCodeAt(0));

    // Load the existing PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Get the number of pages
    const pages = pdfDoc.getPages();

    // Define the watermark text
    const watermarkText = "JOBSNAVIGATOR";

    for (const page of pages) {
      const { width, height } = page.getSize();

      // Draw the watermark
      page.drawText(watermarkText, {
        x: width / 4,
        y: height / 2,
        size: 50,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.5,
        rotate: degrees(45),
      });
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const modifiedPdfBytes = await pdfDoc.save();

    // Convert Uint8Array to base64
    // const base64String = btoa(
    //   String.fromCharCode.apply(null, modifiedPdfBytes)
    // );
    const base64String = convertUint8ArrayToBase64(modifiedPdfBytes);

    return base64String;
  }

  async function onSubmit(data) {
    data.resume = resume;
    data.skills = skills;

    if (resume) {
      const watermarkedResume = await addWatermarkToPdf(resume);
      data.resume = watermarkedResume; // Update the resume with the watermarked version
    }

    // console.log(data);

    // make post request (create)
    makePostRequest(
      setLoading,
      "api/candidates",
      data,
      "Candidate Profile",
      reset
    );
    // setPdfUrl("");
    router.back();
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
            {resume ? "" : "Upload Resume (PDF)"}
          </label>

          {/* Display existing resume with option to remove */}
          {resume && (
            <div className="mb-4">
              <a
                href={`data:application/pdf;base64,${resume}`}
                download="resume.pdf"
                className="text-blue-600 underline text-xl"
              >
                View Uploaded Resume
              </a>
              <button
                type="button"
                onClick={handleRemoveResume}
                className="ml-4 text-red-500 text-xl"
              >
                Remove
              </button>
            </div>
          )}

          {!resume && (
            <input
              type="file"
              id="resume"
              accept=".pdf"
              onChange={handleFileChange} // Update state with selected file
              className="block w-full text-gray-900 dark:text-gray-200 border rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-lime-700"
              // required={!resume} // Only required if there's no resume uploaded
              // required // Optional: make it required
            />
          )}

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
        buttonTitle={id ? "Update Profile" : "Create Profile "}
        loadingButtonTitle={`${
          id ? "Updating" : "Creating"
        } Profile Please wait ...`}
      />
    </form>
  );
}
