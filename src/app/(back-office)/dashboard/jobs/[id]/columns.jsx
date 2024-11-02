"use client";
import { Checkbox } from "@/components/ui/checkbox";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import { useState } from "react";
import SelectInput from "@/components/FormInputs/SelectInput";
import { useForm } from "react-hook-form";
import { statusData } from "@/data";
import SelectInputTwo from "@/components/FormInputs/SelectInputTwo";

const statusOptions = statusData;

const base64ToBlob = (base64, type = "application/pdf") => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  return new Blob([byteNumbers], { type });
};

export const columns = (updateStatus) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableColumn column={column} title="Name" />,
  },
  {
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <SortableColumn column={column} title="Contact Number" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableColumn column={column} title="Email" />,
  },
  {
    accessorKey: "currentCompany",
    header: ({ column }) => (
      <SortableColumn column={column} title="Current Company" />
    ),
  },
  {
    accessorKey: "currentJobLocation",
    header: ({ column }) => (
      <SortableColumn column={column} title="Current Location" />
    ),
  },
  {
    accessorKey: "currentCtc",
    header: ({ column }) => (
      <SortableColumn column={column} title="Current Salary (LPA)" />
    ),
  },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => <SortableColumn column={column} title="Status" />,
  //   cell: ({ row }) => {
  //     const [status, setStatus] = useState(row.original.status);

  //     const handleChange = async (e) => {
  //       const newStatus = e.target.value;

  //       // Show a confirmation dialog
  //       const isConfirmed = window.confirm(
  //         `Are you sure you want to change the status to ${newStatus}?`
  //       );

  //       if (isConfirmed) {
  //         setStatus(newStatus); // Optimistically update the status

  //         // Perform API call to update status
  //         try {
  //           const response = await fetch("/api/updateStatus", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               id: row.original.id,
  //               status: newStatus,
  //             }),
  //           });

  //           if (!response.ok) {
  //             throw new Error("Failed to update status");
  //           }

  //           updateStatus(row.original.id, newStatus); // Call parent function to update state if needed
  //           alert("Status updated successfully!");
  //         } catch (error) {
  //           console.error("Error updating status:", error);
  //           alert("Failed to update status. Please try again.");
  //         }
  //       }
  //     };

  //     return (
  //       <SelectInput
  //         name="status"
  //         register={() => {}} // No need for register here
  //         errors={{}} // No need for errors here
  //         className="w-full dark:text-black"
  //         options={statusOptions}
  //         value={status} // Ensure the value reflects the current status
  //         onChange={handleChange} // Handle status change
  //       />
  //     );
  //   },
  // },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableColumn column={column} title="Status" />,
    cell: ({ row }) => {
      const { status: initialStatus, id } = row.original;
      console.log("initial Status", initialStatus);

      const handleChange = async (e) => {
        console.log("Dropdown changed"); // Add this line
        const newStatus = e.target.value;

        // Show a confirmation dialog
        const isConfirmed = window.confirm(
          `Are you sure you want to change the status to ${newStatus}?`
        );

        if (isConfirmed) {
          // Perform API call to update status
          try {
            const response = await fetch("/api/updateStatus", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id,
                status: newStatus,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to update status");
            }

            updateStatus(id, newStatus); // Call parent function to update state if needed
            alert("Status updated successfully!");
          } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status. Please try again.");
          }
        }
      };

      return (
        <SelectInputTwo
          name="status"
          value={initialStatus} // Use the initial status passed from row.original
          register={() => {}} // No need for register here
          errors={{}} // No need for errors here
          // className="w-full dark:text-black"
          onChange={handleChange} // Handle status change
          options={statusOptions}
          className="w-full dark:text-black"
        />
      );
    },
  },
  {
    id: "view",
    header: ({ column }) => <SortableColumn column={column} title="CV" />,
    cell: ({ row }) => {
      const applicant = row.original;

      const handlePreview = () => {
        const blob = base64ToBlob(applicant.resume); // Convert Base64 to Blob
        const url = URL.createObjectURL(blob); // Create an object URL
        window.open(url); // Open the URL in a new tab or window
      };

      return (
        <button
          onClick={handlePreview}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Preview
          </span>
        </button>
      );
    },
  },
];
