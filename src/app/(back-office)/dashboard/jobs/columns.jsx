"use client";
import { Checkbox } from "@/components/ui/checkbox";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const columns = [
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
    accessorKey: "jobSector",
    header: ({ column }) => <SortableColumn column={column} title="Sector" />,
  },
  {
    accessorKey: "jobDomain",
    header: ({ column }) => <SortableColumn column={column} title="Domain" />,
  },
  {
    accessorKey: "jobTitle",
    header: ({ column }) => <SortableColumn column={column} title="Title" />,
  },
  {
    accessorKey: "jobSalary",
    header: ({ column }) => <SortableColumn column={column} title="CTC" />,
  },
  {
    accessorKey: "jobLocation",
    header: ({ column }) => <SortableColumn column={column} title="Location" />,
  },
  {
    accessorKey: "jobVacanciesRemaining",
    header: ({ column }) => (
      <SortableColumn column={column} title="Remaining Vacancies" />
    ),
  },
  {
    id: "view",
    cell: ({ row }) => {
      const job = row.original;
      return (
        <Link href={`/dashboard/jobs/${job.id}`}>
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              View Job
            </span>
          </button>
        </Link>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const job = row.original;
      // console.log(job);

      return (
        <ActionColumn
          row={row}
          title="Job"
          editEndpoint={`jobs/update/${job.id}`}
          endpoint={`jobs/${job.id}`}
        />
      );
    },
  },
];
