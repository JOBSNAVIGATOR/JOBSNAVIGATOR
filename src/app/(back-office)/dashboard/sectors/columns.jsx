"use client";
import { Checkbox } from "@/components/ui/checkbox";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ConsultantAssignment from "@/components/backOffice/forms/ConsultantAssignment";

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
    accessorKey: "sectorName",
    header: ({ column }) => (
      <SortableColumn column={column} title="Sector Name" />
    ),
  },
  {
    accessorKey: "domains",
    header: ({ column }) => <SortableColumn column={column} title="Domains" />,
    cell: ({ row }) => {
      // Get the domains array from the row
      const domains = row.original.domains;

      return (
        <div className="flex flex-wrap gap-4">
          {domains.length > 0 ? (
            domains.map((domain, index) => (
              <span
                key={index}
                className="bg-gray-400 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-lime-500 focus:border-lime-500 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-lime-500 dark:focus:border-lime-500 flex items-center justify-center"
              >
                {domain}
              </span>
            ))
          ) : (
            <span>No domains available</span>
          )}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const sector = row.original;
      // console.log(sector);

      return (
        <ActionColumn
          row={row}
          title="Sector"
          editEndpoint={`sectors/update/${sector.id}`}
          endpoint={`sectors/${sector.id}`}
        />
      );
    },
  },
];
