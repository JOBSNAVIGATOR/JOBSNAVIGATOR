"use client";
import Heading from "@/components/backOffice/Heading";
import DataTable from "@/components/data-table-components/DataTable";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BottomGradient } from "@/components/ui/BottomGradient";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";
import SelectInputThree from "@/components/FormInputs/SelectInputThree";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data, error } = useSWR("/api/bulkUpload", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState([]); // State to store uploaded data
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const [sectorsData, setSectorsData] = useState([]);
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [domainOptions, setDomainOptions] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);
  const { data: session, status } = useSession();
  const consultantName = session?.user?.name;

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

    // Find districts for the selected sector
    const state = statesData.find((s) => s.id === selectedStateId);
    setDistrictOptions(state ? state.districts : []);
  };

  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
  };

  // Handle district change
  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  // if (error) return <div>Error loading candidates.</div>;

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-bold">
          {error.message ||
            "An unexpected error occurred while loading candidates."}
        </p>
      </div>
    );
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <AnimatedBoxes />
      </div>
    );

  if (data.length === 0) {
    return (
      <div className="mt-4 py-4">
        <Heading title="Bulk Upload" />
        <p className="text-center text-gray-500">
          No candidates uploaded yet. Please upload a file.
        </p>
      </div>
    );
  }

  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (!file || file.type !== "text/csv") {
      toast.error("Please upload a valid .csv file.");
      return;
    }
    setUploadedData(file);
  };

  async function onSubmit(data) {
    // Find sector and domain names based on selected IDs
    const sector = sectorsData.find((s) => s.id === selectedSector);
    const domain = domainOptions.find((d) => d.id === selectedDomain);
    const sectorName = sector?.sectorName;
    const domainName = domain?.name;

    const state = statesData.find((s) => s.id === selectedState);
    const district = districtOptions.find((d) => d.id === selectedDistrict);
    const state_name = state?.state_name;
    const district_name = district?.district_name;
    // Only pass IDs for sector and domain, not the entire object
    data.state = selectedState;
    data.district = selectedDistrict;
    data.file = uploadedData;

    // Create FormData object
    const formData = new FormData();
    formData.append("file", uploadedData); // Append file
    formData.append("state", selectedState);
    formData.append("state_name", state_name);
    formData.append("district", selectedDistrict);
    formData.append("district_name", district_name);
    formData.append("sector", selectedSector);
    formData.append("sectorName", sectorName);
    formData.append("domain", selectedDomain);
    formData.append("domainName", domainName);
    formData.append("consultantName", consultantName);

    setLoading(true);
    const res = await fetch("/api/bulkUpload", {
      method: "POST",
      body: formData,
    });

    const finalData = await res.json();
    // console.log(data);
    if (finalData.success) {
      // Assuming the response contains the uploaded data in `data.candidates`
      setLoading(false);
      toast.success(`New Candidates Created Successfully`);
      setUploadedData(finalData.candidates); // Update the state with uploaded candidate data
    } else {
      setLoading(false);
      toast.error(
        `Error: ${
          finalData.message || "An unknown error occurred during file upload."
        }`
      );
      console.error("Error uploading file", finalData.message);
    }
  }

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <AnimatedBoxes />
    </div>
  ) : (
    <div className="mt-4 py-4">
      {/* Header */}

      <Heading title="Bulk Upload" />

      <div className="flex justify-between mb-4">
        <a
          href="/candidateFormat.csv" // Path to your static file in the public folder
          download="candidateFormat.csv"
          className=" text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 rounded-lg text-md px-5 py-2.5 text-center me-2 font-bold "
        >
          Download Sample Format
        </a>
        <button className=" " onClick={() => router.back()}>
          <X className="w-16 font-extrabold" />
        </button>
      </div>

      {/* Upper second section to upload data */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 ">
        <div className="flex justify-between items-center">
          <SelectInputThree
            label="Sector"
            name="sector"
            // register={register}
            register={register("sector", { required: true })} // Ensure gender is registered
            errors={errors}
            // className="w-full"
            // options={sectorOptions}
            options={sectorsData.map((sector) => ({
              value: sector.id,
              label: sector.sectorName,
            }))}
            onChange={handleSectorChange}
          />
          <SelectInputThree
            label="Domain"
            name="domain"
            // register={register}
            register={register("domain", { required: true })} // Ensure gender is registered
            errors={errors}
            className="w-full"
            // options={domainOptions}
            options={domainOptions.map((domain) => ({
              value: domain.id,
              label: domain.name,
            }))}
            onChange={handleDomainChange}
          />
          <SelectInputThree
            label="State"
            name="state"
            register={register("state", { required: true })} // Ensure gender is registered
            errors={errors}
            // className="w-full"
            options={statesData.map((state) => ({
              value: state.id,
              label: state.state_name,
            }))}
            onChange={handleStateChange}
          />
          <SelectInputThree
            label="City"
            name="district"
            // register={register}
            register={register("district", { required: true })} // Ensure gender is registered
            errors={errors}
            className="w-full"
            // options={domainOptions}
            options={districtOptions.map((districtOption) => ({
              value: districtOption.id,
              label: districtOption.district_name,
            }))}
            onChange={handleDistrictChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <input
            type="file"
            name="file"
            accept=".csv"
            required
            onChange={handleFileChange}
          />

          {loading ? (
            <button
              disabled
              // type="submit"
              className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2 font-bold"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 mr-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Processing Data
            </button>
          ) : (
            <button
              type="submit"
              className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2 font-bold"
            >
              Upload Candidates
              <BottomGradient />
            </button>
          )}
        </div>
      </form>

      {/* lower section to see the uploaded data */}
      {/* table */}
      <div className="py-8">
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}
