"use client";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SelectInput from "@/components/FormInputs/SelectInput";
import SelectInputThree from "@/components/FormInputs/SelectInputThree";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextAreaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
import { fetcher } from "@/lib/fetcher";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import useSWR from "swr";

export default function JobForm({ updateData = {} }) {
  const initialSkills = updateData?.skillsRequired ?? [];
  const [skillsRequired, setSkillsRequired] = useState(initialSkills);
  const id = updateData?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // const [sectorName, setSectorName] = useState("");
  // const [domainName, setDomainName] = useState("");
  const [sectorsData, setSectorsData] = useState([]);
  const [selectedSector, setSelectedSector] = useState(
    updateData?.sector?.id ?? ""
  );
  const [selectedDomain, setSelectedDomain] = useState(
    updateData?.domain?.id ?? ""
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
      ...updateData,
      isActive: true,
    },
  });
  const isActive = watch("isActive");
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

  const { data: companies, error } = useSWR("/api/companies", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  const { data: clients, errorClients } = useSWR("/api/clients", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint

  // Transform companies data for SelectInput
  const companyOptions = companies
    ? companies.map((company) => ({
        value: company.id, // Assuming 'id' is the unique identifier
        label: company.companyName, // Use 'companyName' as the label
      }))
    : [];

  // Transform companies data for SelectInput
  const clientOptions = clients
    ? clients.map((client) => ({
        value: client.id, // Assuming 'id' is the unique identifier
        label: client.name, // Use 'companyName' as the label
      }))
    : [];

  const { data: session, status } = useSession();
  if (status === "loading") {
    // <Loading />;
    <p>loading...</p>;
  }
  // const user = session?.user;

  async function onSubmit(data) {
    data.skillsRequired = skillsRequired;
    data.postedBy = session?.user?.id;
    // Find sector and domain names based on selected IDs
    const sector = sectorsData.find((s) => s.id === selectedSector);
    const domain = domainOptions.find((d) => d.id === selectedDomain);

    data.sector = selectedSector;
    data.domain = selectedDomain;
    // data.sectorName = sectorName;
    // data.domainName = domainName;
    data.sectorName = sector?.sectorName;
    data.domainName = domain?.name;
    // console.log(data);
    // Handle form submission logic
    if (id) {
      // make put request (update)
      makePutRequest(setLoading, `api/jobs/${id}`, data, "Job", reset);
      router.back();
    } else {
      makePostRequest(setLoading, "api/jobs", data, "Jobs", reset);
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
          label="Title"
          type="text"
          name="jobTitle"
          register={register}
          errors={errors}
          className="w-full"
        />
        <SelectInput
          label="Company"
          name="jobCompany"
          register={register}
          errors={errors}
          className="w-full"
          options={companyOptions || []}
        />
        <TextAreaInput
          label="Job Description"
          name="jobDescription"
          register={register}
          errors={errors}
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
          label="Client SPOC"
          name="clientId"
          register={register("clientId", { required: true })} // Ensure gender is registered
          errors={errors}
          className="w-full"
          options={clientOptions || []}
          // onChange={handleDomainChange}
          value={updateData?.clientSpoc?.user?.name ?? ""}
        />

        <TextInput
          label="Total Vacancies"
          type="number"
          name="jobVacancies"
          register={register}
          errors={errors}
          className="w-full"
          placeholder="Positions"
        />
        <TextInput
          label="Remaining Vacancies"
          type="number"
          name="jobVacanciesRemaining"
          register={register}
          errors={errors}
          className="w-full"
          placeholder="Positions Remaining"
        />
        <TextInput
          label="Location"
          type="text"
          name="jobLocation"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="CTC"
          type="text"
          name="jobSalary"
          register={register}
          errors={errors}
          className="w-full"
        />

        <ArrayItemsInput
          items={skillsRequired}
          setItems={setSkillsRequired}
          itemTitle="Skills Required"
        />
        <ToggleInput
          label="Is Active ?"
          name="isActive"
          trueTitle="Active"
          falseTitle="Expired"
          register={register}
        />
      </div>
      <br />

      <SubmitButton
        isLoading={loading}
        buttonTitle={id ? "Update Job" : "Create Job"}
        loadingButtonTitle={`${
          id ? "Updating" : "Creating"
        } Job Please wait ...`}
      />
    </form>
  );
}
