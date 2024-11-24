"use client";
import Heading from "@/components/backOffice/Heading";
import DataTable from "@/components/data-table-components/DataTable";
import React, { useState } from "react";
import { X } from "lucide-react";
import { columns } from "./columns";
import FormHeader from "@/components/backOffice/FormHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { BottomGradient } from "@/components/ui/BottomGradient";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function Page() {
  const { data, error } = useSWR("/api/bulkUpload", fetcher, {
    refreshInterval: 5000, // refetch data every 5 seconds
  }); // replace with your API endpoint
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState([]); // State to store uploaded data

  if (error) return <div>Error loading candidates.</div>;
  if (!data) return <div>Loading...</div>;

  const handleFileUpload = async (event) => {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData();
    const fileInput = event.target.elements.file;
    const file = fileInput.files[0];

    formData.append("file", file);

    const res = await fetch("/api/bulkUpload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    if (data.success) {
      // Assuming the response contains the uploaded data in `data.candidates`
      setLoading(false);
      toast.success(`New Candidates Created Successfully`);
      setUploadedData(data.candidates); // Update the state with uploaded candidate data
    } else {
      setLoading(false);
      toast.error("Some Error has Occurred");
      console.error("Error uploading file", data.message);
    }
  };

  return (
    <div className="mt-4 py-4">
      {/* Header */}
      <div>
        <Heading title="Bulk Upload" />
        <button className="fixed right-4 top-32 " onClick={() => router.back()}>
          <X className="w-16 font-extrabold" />
        </button>
      </div>

      {/* Upper second section to upload data */}
      <form onSubmit={handleFileUpload} className="flex justify-between  ">
        <input type="file" name="file" accept=".csv" required />
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
      </form>

      {/* lower section to see the uploaded data */}
      {/* table */}
      <div className="py-8">
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}
