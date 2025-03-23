"use client";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextInput from "@/components/FormInputs/TextInput";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ArrayItemsInput from "../FormInputs/ArrayItemsInput";
import { domainsData, genderData, sectorsData } from "@/data";
import { degrees, PDFDocument, rgb } from "pdf-lib";
import SelectInputThree from "../FormInputs/SelectInputThree";
// import ImageInput from "../FormInputs/ImageInput";

export default function CandidateForm({ user, updateData = {} }) {
  const initialResumeUrl = updateData?.candidateProfile?.resume ?? "";
  const initialSkills = updateData?.candidateProfile?.skills ?? [];
  const id = updateData?.candidateProfile?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(initialSkills);
  const [resume, setResume] = useState(initialResumeUrl); // State for resume upload
  const [sectorsData, setSectorsData] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [selectedSector, setSelectedSector] = useState(
    updateData?.candidateProfile?.sector?.id ?? ""
  );
  const [selectedState, setSelectedState] = useState(
    updateData?.candidateProfile?.state?.id ?? ""
  );
  const [selectedDomain, setSelectedDomain] = useState(
    updateData?.candidateProfile?.domain?.id ?? ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    updateData?.candidateProfile?.district?.id ?? ""
  );
  const [domainOptions, setDomainOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
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
  // Fetch sectors and domains on component mount
  // useEffect(() => {
  //   async function fetchSectors() {
  //     const response = await fetch("/api/sectors");
  //     const data = await response.json();
  //     setSectorsData(data);
  //   }
  //   fetchSectors();
  // }, [updateData]);

  useEffect(() => {
    fetch("/api/sectors")
      .then((res) => res.json())
      .then((data) => setSectorsData(data))
      .catch((err) => console.error("Error fetching sectors:", err));

    fetch("/api/states")
      .then((res) => res.json())
      .then((data) => setStatesData(data));
  }, [updateData]);
  // console.log(sectorsData);
  // Handle sector change and update domains
  const handleSectorChange = (event) => {
    const selectedSectorId = event.target.value;
    setSelectedSector(selectedSectorId);

    // Find domains for the selected sector
    const sector = sectorsData.find((s) => s.id === selectedSectorId);
    setDomainOptions(sector ? sector.domains : []);
  };
  // Handle state change and update districts
  const handleStateChange = (event) => {
    const selectedStateId = event.target.value;
    setSelectedState(selectedStateId);

    // Find domains for the selected sector
    const state = statesData.find((s) => s.id === selectedStateId);
    setDistrictOptions(state ? state.districts : []);
  };
  // Automatically update domain options when sector is set or updated
  useEffect(() => {
    if (selectedSector) {
      const sector = sectorsData.find((s) => s.id === selectedSector);
      setDomainOptions(sector ? sector.domains : []);
    }
  }, [selectedSector, sectorsData]);

  // Automatically update districts options when state is set or updated
  useEffect(() => {
    if (selectedState) {
      const state = statesData.find((s) => s.id === selectedState);
      setDistrictOptions(state ? state.districts : []);
    }
  }, [selectedState, statesData]);

  // Handle domain change
  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
  };
  // Handle district change
  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  const genderOptions = genderData;

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
    // Find sector and domain names based on selected IDs
    const sector = sectorsData.find((s) => s.id === selectedSector);
    const domain = domainOptions.find((d) => d.id === selectedDomain);
    // Only pass IDs for sector and domain, not the entire object
    data.sector = selectedSector;
    data.domain = selectedDomain;
    data.sectorName = sector?.sectorName;
    data.domainName = domain?.name;
    // Find state and district names based on selected IDs
    const state = statesData.find((s) => s.id === selectedState);
    const district = districtOptions.find((d) => d.id === selectedDistrict);
    // Only pass IDs for sector and domain, not the entire object
    data.state = selectedState;
    data.district = selectedDistrict;
    data.state_name = state?.state_name;
    data.district_name = district?.district_name;

    data.resume = resume;
    data.skills = skills;

    if (resume) {
      const watermarkedResume = await addWatermarkToPdf(resume);
      data.resume = watermarkedResume; // Update the resume with the watermarked version
    }
    console.log("data", data);

    if (id) {
      // make put request (update)
      makePutRequest(
        setLoading,
        "api/candidateProfile",
        data,
        "Candidate Profile"
      );
      // setPdfUrl("");
      router.back();
    } else {
      // make post request (create)
      data.userId = user.id;
      makePostRequest(
        setLoading,
        "api/onboarding",
        data,
        "Candidate Profile"
        // reset
      );
      // setPdfUrl("");
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
          label="Alternate Contact Number"
          name="emergencyContactNumber"
          type="tel"
          register={register}
          errors={errors}
          className="w-full"
          isRequired={false}
          maxLength="10"
          validation={{
            pattern: {
              // value: /^\s*\d{10}\s*$/, // Allows spaces but ensures exactly 10 digits
              value: /^[0-9]{10}$/, // Regex to allow only 6 digits
              message: "Mobile number must be exactly 10 digits",
            },
            maxLength: {
              value: 10, // Restricts input length to 6
              message: "Mobile number cannot exceed 10 digits",
            },
          }}
        />
        <SelectInputThree
          label="Gender"
          name="gender"
          register={register("gender", { required: true })} // Ensure gender is registered
          errors={errors}
          className="w-full"
          options={genderOptions}
        />
        <SelectInputThree
          label="Sector"
          name="sector"
          register={register("sector", { required: true })} // Ensure gender is registered
          errors={errors}
          className="w-full"
          options={sectorsData.map((sector) => ({
            value: sector.id,
            label: sector.sectorName,
          }))}
          onChange={handleSectorChange}
          value={selectedSector}
        />
        <SelectInputThree
          label="Domain"
          name="domain"
          register={register("domain", { required: true })} // Ensure gender is registered
          errors={errors}
          className="w-full"
          options={domainOptions.map((domain) => ({
            value: domain.id,
            label: domain.name,
          }))}
          onChange={handleDomainChange}
          value={selectedDomain}
        />
        <SelectInputThree
          label="State"
          name="state"
          register={register("state", { required: true })} // Ensure gender is registered
          errors={errors}
          className="w-full"
          options={statesData.map((state) => ({
            value: state.id,
            label: state.state_name,
          }))}
          onChange={handleStateChange}
          value={selectedState}
        />
        <SelectInputThree
          label="District"
          name="district"
          register={register("district", { required: true })} // Ensure gender is registered
          errors={errors}
          className="w-full"
          options={districtOptions.map((district) => ({
            value: district.id,
            label: district.district_name,
          }))}
          onChange={handleDistrictChange}
          value={selectedDistrict}
        />
        <TextInput
          label="Designation"
          name="designation"
          register={register}
          errors={errors}
          className="w-full"
          type="text"
          maxLength="20"
          minLength="2"
          validation={{
            required: "Designation is Required",
            pattern: {
              value: /^[A-Za-z\s]{2,20}$/,
              message: "Only letters & spaces (2-50 chars)",
            },
            maxLength: {
              value: 20,
              message: "Maximum 20 characters allowed",
            },
            minLength: {
              value: 2,
              message: "At least 2 characters required",
            },
          }}
        />
        <TextInput
          label="Current Company"
          name="currentCompany"
          register={register}
          errors={errors}
          className="w-full"
          type="text"
          maxLength="20"
          minLength="2"
          validation={{
            required: "Company is Required",
            pattern: {
              value: /^[A-Za-z\s]{2,20}$/,
              message: "Only letters & spaces (2-50 chars)",
            },
            maxLength: {
              value: 20,
              message: "Maximum 20 characters allowed",
            },
            minLength: {
              value: 2,
              message: "At least 2 characters required",
            },
          }}
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
          maxLength="2"
          validation={{
            pattern: {
              // value: /^\s*\d{10}\s*$/, // Allows spaces but ensures exactly 10 digits
              value: /^[0-9]{1,2}$/, // Regex to allow only 6 digits
              message: "Experience must must be 1 or 2 digits",
            },
            maxLength: {
              value: 2, // Restricts input length to 4
              message: "Experience cannot exceed 2 digits",
            },
          }}
        />
        <TextInput
          label="Current CTC"
          name="currentCtc"
          register={register}
          errors={errors}
          className="w-full"
          maxLength="5"
          validation={{
            pattern: {
              value: /^[0-9]{1,2}(\.[0-9]{1,2})?$/, // Allows 1 or 2 digits optionally followed by a dot and a single digit
              message:
                "CTC must be a valid number (e.g., 1, 1.2, 1.23, 21, 21.99)",
            },
          }}
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
          validation={{
            pattern: {
              // value: /^\s*\d{10}\s*$/, // Allows spaces but ensures exactly 10 digits
              value: /^[0-9]{4}$/, // Regex to allow only 6 digits
              message: "Year must be exactly 4 digits",
            },
            maxLength: {
              value: 4, // Restricts input length to 4
              message: "Year cannot exceed 4 digits",
            },
          }}
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
