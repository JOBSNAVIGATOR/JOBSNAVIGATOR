"use client";

import SubmitButton from "../FormInputs/SubmitButton";

export default function BulkUpload() {
  const handleFileUpload = async (event) => {
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
    // console.log(data);
  };

  return (
    <div>
      {/* Upper section to upload data */}
      <form onSubmit={handleFileUpload} className="flex justify-between  ">
        <input type="file" name="file" accept=".csv" required />
        <button
          type="submit"
          className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2 font-bold"
        >
          Upload Candidates
        </button>
      </form>
      {/* lower section to see the uploaded data */}
      {/* table */}
      {/* <div className="py-8">
        <DataTable data={data} columns={columns} />
      </div> */}
    </div>
  );
}
