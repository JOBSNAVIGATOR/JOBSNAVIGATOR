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
  console.log("iupdateData", updateData);

  const initialSkills = updateData?.skillsRequired ?? [];
  const [skillsRequired, setSkillsRequired] = useState(initialSkills);
  const id = updateData?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sectorsData, setSectorsData] = useState([]);
  const [selectedSector, setSelectedSector] = useState(
    updateData?.sector?.id ?? ""
  );
  const [selectedDomain, setSelectedDomain] = useState(
    updateData?.domain?.id ?? ""
  );
  const [domainOptions, setDomainOptions] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [selectedState, setSelectedState] = useState(
    updateData?.state?.id ?? ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    updateData?.district?.id ?? ""
  );
  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(
    updateData?.jobCompany?.id ?? ""
  );
  const [selectedClient, setSelectedClient] = useState(
    updateData?.clientSpoc?.id ?? ""
  );

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

  useEffect(() => {
    fetch("/api/sectors")
      .then((res) => res.json())
      .then((data) => setSectorsData(data))
      .catch((err) => console.error("Error fetching sectors:", err));

    fetch("/api/states")
      .then((res) => res.json())
      .then((data) => setStatesData(data))
      .catch((err) => console.error("Error fetching states:", err));
  }, []);

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
  // Handle state change and update districts
  const handleStateChange = (event) => {
    const selectedStateId = event.target.value;
    setSelectedState(selectedStateId);
    setSelectedDistrict("");

    // Find districts for the selected sector
    const state = statesData.find((s) => s.id === selectedStateId);
    setDistrictOptions(state ? state.districts : []);
  };

  // Automatically update domain options when sector is set or updated
  useEffect(() => {
    if (selectedSector && sectorsData.length > 0) {
      const sector = sectorsData.find((s) => s.id === selectedSector);
      setDomainOptions(sector ? sector.domains : []);
    }
  }, [selectedSector, sectorsData]);
  // Automatically update district options when state is set or updated
  useEffect(() => {
    if (selectedState && statesData.length > 0) {
      const state = statesData.find((s) => s.id === selectedState);
      setDistrictOptions(state ? state.districts : []);
    }
  }, [selectedState, statesData]);

  // Handle domain change
  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
    // setDomainName(event.target.name);
  };
  // Handle district change
  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };
  // Handle company change
  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };
  // Handle client change
  const handleClientChange = (event) => {
    setSelectedClient(event.target.value);
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
    data.sector = selectedSector;
    data.sectorName = sector?.sectorName;
    data.domain = selectedDomain;
    const domain = domainOptions.find((d) => d.id === selectedDomain);
    data.domainName = domain?.name;

    const state = statesData.find((s) => s.id === selectedState);
    const district = districtOptions.find((d) => d.id === selectedDistrict);
    // Only pass IDs for sector and domain, not the entire object
    data.state = selectedState;
    data.district = selectedDistrict;
    data.state_name = state?.state_name;
    data.district_name = district?.district_name;

    data.jobCompany = selectedCompany;
    data.clientId = selectedClient;
    // Handle form submission logic
    if (id) {
      console.log("submitted", data);
      // make put request (update)
      makePutRequest(setLoading, `api/jobs/${id}`, data, "Job", reset);
      // router.back();
    } else {
      makePostRequest(setLoading, "api/jobs", data, "Job", reset);
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
        {/* <SelectInput
          label="Company"
          name="jobCompany"
          register={register}
          errors={errors}
          className="w-full"
          options={companyOptions || []}
        /> */}
        <SelectInputThree
          label="Company"
          name="jobCompany"
          register={register("jobCompany", { required: true })}
          errors={errors}
          className="w-full"
          options={companyOptions}
          onChange={handleCompanyChange}
          value={selectedCompany}
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
          register={register("sector", { required: true })}
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
          register={register("domain", { required: true })}
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
          register={register("state", { required: true })}
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
          register={register("district", { required: true })}
          errors={errors}
          className="w-full"
          options={districtOptions.map((district) => ({
            value: district.id,
            label: district.district_name,
          }))}
          onChange={handleDistrictChange}
          value={selectedDistrict}
        />
        <SelectInputThree
          label="Client SPOC"
          name="clientId"
          register={register("clientId", { required: true })}
          errors={errors}
          className="w-full"
          options={clientOptions || []}
          onChange={handleClientChange}
          value={selectedClient}
        />

        <TextInput
          label="Total Vacancies"
          type="number"
          name="jobVacancies"
          register={register}
          errors={errors}
          className="w-full"
          placeholder="Positions"
          maxLength="2"
          validation={{
            pattern: {
              value: /^[0-9]{1,2}$/, // Allows only 1-2 digit numbers
              message: "Vacancies must be 1 or 2 digits",
            },
            maxLength: {
              value: 2,
              message: "Vacancies cannot exceed 2 digits",
            },
            min: {
              value: 1,
              message: "Vacancies must be at least 1",
            },
          }}
        />
        <TextInput
          label="Remaining Vacancies"
          type="number"
          name="jobVacanciesRemaining"
          register={register}
          errors={errors}
          className="w-full"
          placeholder="Positions Remaining"
          maxLength="2"
          validation={{
            pattern: {
              value: /^[0-9]{1,2}$/,
              message: "Remaining Vacancies must be 1 or 2 digits",
            },
            maxLength: {
              value: 2,
              message: "Remaining Vacancies cannot exceed 2 digits",
            },
            validate: (value) => {
              const totalVacancies = watch("jobVacancies");
              if (Number(value) > Number(totalVacancies)) {
                return "Remaining Vacancies cannot be more than Total Vacancies";
              }
              return true;
            },
          }}
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
          maxLength="5"
          validation={{
            pattern: {
              value: /^[0-9]{1,2}(\.[0-9]{1,2})?$/, // Allows 1 or 2 digits optionally followed by a dot and a single digit
              message:
                "CTC must be a valid number (e.g., 1, 1.2, 1.23, 21, 21.99)",
            },
          }}
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
