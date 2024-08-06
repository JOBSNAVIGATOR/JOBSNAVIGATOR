"use client";
import { Checkbox } from "@/components/ui/checkbox";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import { useState } from "react";
import SelectInput from "@/components/FormInputs/SelectInput";
import { useForm } from "react-hook-form";

const statusOptions = [
  { value: "Applied", label: "Applied" },
  { value: "Interviewed", label: "Interviewed" },
  { value: "Offered", label: "Offered" },
  { value: "Rejected", label: "Rejected" },
];

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
  // {
  //   accessorKey: "fullName",
  //   header: ({ column }) => <SortableColumn column={column} title="Name" />,
  //   cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  // },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <SortableColumn column={column} title="First Name" />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <SortableColumn column={column} title="Last Name" />
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
    accessorKey: "location",
    header: ({ column }) => (
      <SortableColumn column={column} title="Current Location" />
    ),
  },
  {
    accessorKey: "currentSalary",
    header: ({ column }) => (
      <SortableColumn column={column} title="Current Salary (LPA)" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableColumn column={column} title="Status" />,
    cell: ({ row }) => {
      const [status, setStatus] = useState(row.original.status);

      const handleChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        updateStatus(row.original.id, newStatus); // Update status
      };

      return (
        <SelectInput
          // label="Status"
          name="status"
          register={() => {}} // No need for register here
          errors={{}} // No need for errors here
          className="w-full dark:text-black"
          options={statusOptions}
          value={status} // Ensure the value reflects the current status
          onChange={handleChange} // Handle status change
        />
      );
    },
  },
  {
    id: "view",
    header: ({ column }) => <SortableColumn column={column} title="CV" />,
    cell: ({ row }) => {
      const candidate = row.original;
      return (
        <button
          onClick={() => {
            const link = document.createElement("a");
            link.href = candidate.cvLink; // Assuming `cvLink` contains the URL to the candidate's CV
            link.download = `${candidate.firstName}_${candidate.lastName}_CV.pdf`; // Filename format for download
            link.click();
          }}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Preview/Download
          </span>
        </button>
      );
    },
  },
];
