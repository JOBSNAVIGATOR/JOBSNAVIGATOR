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
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function ClientFormTwo({ user, updateData = {} }) {
  const id = updateData?.clientProfile?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sectorsData, setSectorsData] = useState([]);
  const [selectedSector, setSelectedSector] = useState(
    updateData?.clientProfile?.sector?.id ?? ""
  );
  const [selectedDomain, setSelectedDomain] = useState(
    updateData?.clientProfile?.domain?.id ?? ""
  );
  const [domainOptions, setDomainOptions] = useState([]);
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
    },
  });
  const isActive = watch("isActive");
  const { data: companies, error } = useSWR("/api/companies", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  // Transform companies data for SelectInput
  const companyOptions = companies
    ? companies.map((company) => ({
        value: company.id, // Assuming 'id' is the unique identifier
        label: company.companyName, // Use 'companyName' as the label
      }))
    : [];

  // Fetch sectors and domains on component mount
  useEffect(() => {
    async function fetchSectors() {
      const response = await fetch("/api/sectors");
      const data = await response.json();
      setSectorsData(data);
    }
    fetchSectors();
  }, [updateData]);

  const handleSectorChange = (event) => {
    const selectedSectorId = event.target.value;
    setSelectedSector(selectedSectorId);
    // Ensure domain selection resets if sector changes
    setSelectedDomain("");

    // Find domains for the selected sector
    const sector = sectorsData.find((s) => s.id === selectedSectorId);
    // setSectorName(sector?.sectorName);
    setDomainOptions(sector ? sector.domains : []);
  };

  // Automatically update domain options when sector is set or updated
  useEffect(() => {
    if (selectedSector && sectorsData.length > 0) {
      const sector = sectorsData.find((s) => s.id === selectedSector);
      setDomainOptions(sector ? sector.domains : []);
    }
  }, [selectedSector, sectorsData]);

  // Handle domain change
  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
    // setDomainName(event.target.name);
  };

  const genderOptions = genderData;
  const functionalAreaOptions = functionalAreaOptionsData;

  async function onSubmit(data) {
    // Find sector and domain names based on selected IDs
    const sector = sectorsData.find((s) => s.id === selectedSector);
    const domain = domainOptions.find((d) => d.id === selectedDomain);
    data.sector = selectedSector;
    data.domain = selectedDomain;
    data.sectorName = sector?.sectorName;
    data.domainName = domain?.name;
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
        />
        <TextInput
          label="Current CTC (LPA)"
          name="currentCtc"
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
