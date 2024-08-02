"use client";
import { Checkbox } from "@/components/ui/checkbox";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";

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
    accessorKey: "jobLevel",
    header: ({ column }) => <SortableColumn column={column} title="Level" />,
  },
  {
    accessorKey: "jobLocation",
    header: ({ column }) => <SortableColumn column={column} title="Location" />,
  },
  {
    accessorKey: "jobVacanciesRemaining",
    header: ({ column }) => <SortableColumn column={column} title="Reamining Vacancies" />,
  },
  {
    accessorKey: "jobApplicants",
    header: ({ column }) => <SortableColumn column={column} title="Applicants" />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const job = row.original;
      return (
        <ActionColumn
          row={row}
          title="Jobs"
          editEndpoint={`jobs/update/${job.id}`}
          endpoint={`jobs/${job.id}`}
        />
      );
    },
  },
];
