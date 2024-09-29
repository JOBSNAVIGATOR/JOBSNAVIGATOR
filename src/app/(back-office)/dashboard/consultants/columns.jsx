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
    accessorKey: "name",
    header: ({ column }) => <SortableColumn column={column} title="Name" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableColumn column={column} title="Email" />,
  },
  {
    accessorKey: "contactNumber",
    header: ({ column }) => <SortableColumn column={column} title="Contact" />,
  },
  {
    accessorKey: "currentAddress",
    header: ({ column }) => <SortableColumn column={column} title="Location" />,
  },
  {
    accessorKey: "currentPotentialPoints",
    header: ({ column }) => (
      <SortableColumn column={column} title="Potential Points" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const consultant = row.original;
      // console.log(consultant);

      return (
        <ActionColumn
          row={row}
          title="Consultant"
          editEndpoint={`consultants/update/${consultant.id}`}
          endpoint={`consultant/${consultant.id}`}
        />
      );
    },
  },
];
