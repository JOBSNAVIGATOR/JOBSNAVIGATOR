"use client";
import { Checkbox } from "@/components/ui/checkbox";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";

const base64ToBlob = (base64, type = "application/pdf") => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  return new Blob([byteNumbers], { type });
};

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
    accessorKey: "candidateCode",
    header: ({ column }) => <SortableColumn column={column} title="Code" />,
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
    accessorKey: "currentJobLocation",
    header: ({ column }) => <SortableColumn column={column} title="Location" />,
  },
  {
    accessorKey: "currentCompany",
    header: ({ column }) => (
      <SortableColumn column={column} title="Current Company" />
    ),
  },
  {
    accessorKey: "currentCtc",
    header: ({ column }) => (
      <SortableColumn column={column} title="Salary (LPA)" />
    ),
  },
  // {
  //   id: "view",
  //   header: ({ column }) => <SortableColumn column={column} title="CV" />,
  //   cell: ({ row }) => {
  //     const candidate = row.original;
  //     return (
  //       <button
  //         onClick={() => {
  //           // Assuming `resume` contains the Base64 URL string
  //           const blob = base64ToBlob(candidate.resume); // Convert Base64 to Blob
  //           const link = document.createElement("a");
  //           const url = URL.createObjectURL(blob); // Create an object URL

  //           link.href = url; // Set the href to the object URL
  //           link.download = `${candidate.name}_CV.pdf`; // Set the filename
  //           document.body.appendChild(link); // Append to body
  //           link.click(); // Trigger the download
  //           document.body.removeChild(link); // Clean up
  //           URL.revokeObjectURL(url); // Free memory
  //         }}
  //         className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
  //       >
  //         <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
  //           Preview/Download
  //         </span>
  //       </button>
  //     );
  //   },
  // },
  {
    id: "view",
    header: ({ column }) => <SortableColumn column={column} title="CV" />,
    cell: ({ row }) => {
      const candidate = row.original;

      const handlePreview = () => {
        const blob = base64ToBlob(candidate.resume); // Convert Base64 to Blob
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

  {
    id: "actions",
    cell: ({ row }) => {
      const candidate = row.original;
      return (
        <ActionColumn
          row={row}
          title="Candidate"
          editEndpoint={`candidates/update/${candidate.id}`}
          endpoint={`candidates/${candidate.id}`}
        />
      );
    },
  },
];
