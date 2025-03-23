"use client";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextInput from "@/components/FormInputs/TextInput";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { functionalAreaOptionsData, genderData } from "@/data";
import SelectInputThree from "@/components/FormInputs/SelectInputThree";
import SelectInput from "@/components/FormInputs/SelectInput";

export default function ClientFormTwo({ user, updateData = {} }) {
  const id = updateData?.clientProfile?.id ?? "";
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
      ...user,
      ...updateData.clientProfile,
      isActive: true,
      sector: updateData?.clientProfile?.sector?.id ?? "", // Ensure sector has a default value
    },
  });

  const [companies, setCompanies] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(
    updateData?.clientProfile?.domain?.id ?? ""
  );
  const [selectedSector, setSelectedSector] = useState(
    updateData?.clientProfile?.sector?.id ?? ""
  );
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(
    updateData?.clientProfile?.district?.id ?? ""
  );
  const [selectedState, setSelectedState] = useState(
    updateData?.clientProfile?.state?.id ?? ""
  );

  const isActive = watch("isActive");
  // initial mount of sector and companies
  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Error fetching companies:", err));

    fetch("/api/sectors")
      .then((res) => res.json())
      .then((data) => setSectors(data));
  }, []);

  useEffect(() => {
    setSelectedSector(watch("sector"));
  }, [watch("sector")]);

  useEffect(() => {
    setSelectedDomain(watch("domain"));
  }, [watch("domain")]);

  // Fetch  domains when selected sector changes
  useEffect(() => {
    if (selectedSector) {
      fetch(`/api/domains?ref_sector_id=${selectedSector}`)
        .then((res) => res.json())
        .then((data) => setDomains(data))
        .catch((err) => console.error("Error fetching domains:", err));
    } else {
      setDomains([]); // Clear cities if no state is selected
    }
  }, [selectedSector]);

  // Transform companies data for SelectInput
  const companyOptions = companies
    ? companies.map((company) => ({
        value: company.id, // Assuming 'id' is the unique identifier
        label: company.companyName, // Use 'companyName' as the label
      }))
    : [];
  const sectorOptions = sectors
    ? sectors.map((sector) => ({
        value: sector.id, // Assuming 'id' is the unique identifier
        label: sector.sectorName, // Use 'companyName' as the label
      }))
    : [];

  const genderOptions = genderData;
  const functionalAreaOptions = functionalAreaOptionsData;

  async function onSubmit(data) {
    const sector = sectors.find((s) => s.id === selectedSector);
    const domain = domains.find((d) => d.value === selectedDomain);
    data.sector = selectedSector;
    data.domain = selectedDomain;
    data.sectorName = sector?.sectorName;
    data.domainName = domain?.label;
    console.log(data);
    setLoading(true);
    if (id) {
      // make put request (update)
      makePutRequest(
        setLoading,
        `api/clients/${id}`,
        data,
        "Client Profile",
        reset
      );
      router.back();
    } else {
      makePostRequest(setLoading, "api/clients", data, "Client Profile", reset);
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
          disabled={Object.keys(updateData).length > 0} // Only disable if updateData has properties
          type="text"
          maxLength="50"
          minLength="2"
          validation={{
            required: "Full Name is Required",
            pattern: {
              value: /^[A-Za-z\s]{2,50}$/,
              message: "Only letters & spaces (2-50 chars)",
            },
            maxLength: {
              value: 50,
              message: "Maximum 50 characters allowed",
            },
            minLength: {
              value: 2,
              message: "At least 2 characters required",
            },
          }}
        />
        <TextInput
          label="Email Address"
          name="email"
          type="email"
          register={register}
          errors={errors}
          className="w-full"
          disabled={Object.keys(updateData).length > 0} // Only disable if updateData has properties
        />
        <TextInput
          label="Contact Number"
          name="contactNumber"
          type="tel"
          register={register}
          errors={errors}
          className="w-full"
          disabled={Object.keys(updateData).length > 0} // Only disable if updateData has properties
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
          // register={register}
          register={register("gender", { required: true })} // Ensure gender is registered
          errors={errors}
          className="w-full"
          options={genderOptions}
        />
        <SelectInput
          label="Sector"
          name="sector"
          register={register}
          errors={errors}
          className="w-full"
          options={sectorOptions}
        />
        <SelectInput
          label="Domain"
          name="domain"
          register={register}
          errors={errors}
          className="w-full"
          options={domains}
        />
        <SelectInput
          label="Company"
          name="currentCompany"
          register={register}
          errors={errors}
          className="w-full"
          options={companyOptions || []}
        />
        <SelectInput
          label="Functional Area"
          name="functionalArea"
          register={register}
          errors={errors}
          className="w-full"
          options={functionalAreaOptions || []}
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
          label="Current CTC (LPA)"
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
          label="Current Job Location"
          name="currentJobLocation"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Date of Partnership"
          name="dateOfJoining"
          type="date"
          register={register}
          errors={errors}
          className="w-full"
        />
        <br />
        <br />
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
