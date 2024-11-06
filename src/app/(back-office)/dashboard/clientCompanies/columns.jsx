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
    accessorKey: "companyName",
    header: ({ column }) => <SortableColumn column={column} title="Label" />,
  },
  {
    accessorKey: "companyDescription",
    header: ({ column }) => (
      <SortableColumn column={column} title="Description" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const company = row.original;
      // console.log(company);

      return (
        <ActionColumn
          row={row}
          title="Company"
          editEndpoint={`clientCompanies/update/${company.id}`}
          endpoint={`companies/${company.id}`}
        />
      );
    },
  },
];
