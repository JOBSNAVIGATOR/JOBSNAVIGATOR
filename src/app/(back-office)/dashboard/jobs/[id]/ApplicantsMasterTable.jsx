"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Box, Button, lighten, ListItemIcon, MenuItem } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { AccountCircle, Delete, Send } from "@mui/icons-material";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import DownloadCSV from "@/components/backOffice/DownloadCsv";
import { BottomGradient } from "@/components/ui/BottomGradient";
import { useCandidates } from "@/context/CandidatesContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Briefcase, MailIcon, Tag } from "lucide-react";
import AssignTagButton from "@/components/backOffice/AssignTagButton";
import AssignJobButton from "@/components/backOffice/AssignJobButton";
import CandidateHistory from "@/components/backOffice/CandidateHistory";
import PreviewResume from "@/components/ui/PreviewResume";
import ChangeStatus from "@/components/backOffice/ChangeStatus";

const Example = ({ data }) => {
  const columns = useMemo(
    () => [
      // Application Details
      {
        id: "applicationDetails", //id used to define `group` column
        header: "Candidate Code",
        columns: [
          {
            accessorKey: "candidateCode", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Candidate Code",
            size: 400,
          },
        ],
      },
      // basic details
      {
        id: "basicDetails", //id used to define `group` column
        header: "Basic Details",
        columns: [
          {
            accessorKey: "name", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Name",
            size: 220,
          },
        ],
      },
      // contact details
      {
        id: "contactDetails", //id used to define `group` column
        header: "Contact Details",
        columns: [
          {
            accessorKey: "email", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Email",
            size: 260,
          },
          {
            accessorKey: "contactNumber", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            // enableClickToCopy: true,
            // filterVariant: "autocomplete",
            header: "Contact Number",
            size: 200,
          },
        ],
      },
      // employment details
      {
        id: "employmentDetails", //id used to define `group` column
        header: "Employment Details",
        columns: [
          {
            accessorKey: "sectorName", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: "Sector",
            filterVariant: "autocomplete",
            size: 250,
          },
          {
            accessorKey: "domainName", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: "Domain",
            enableClickToCopy: true,
            filterVariant: "autocomplete",
            size: 200,
          },
          {
            accessorKey: "currentCompany", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: "Current Company",
            enableClickToCopy: true,
            filterVariant: "autocomplete",
            size: 200,
          },
          {
            accessorKey: "designation", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: "Designation",
            enableClickToCopy: true,
            filterVariant: "autocomplete",
            size: 200,
          },
          {
            accessorKey: "currentJobLocation", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Job Location",
            size: 200,
          },

          {
            accessorKey: "currentCtc", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: "Current CTC (LPA)",
            // enableClickToCopy: true,
            // filterVariant: "autocomplete",
            size: 200,
          },

          {
            accessorKey: "totalWorkingExperience", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: "Total Working Experience",
            // enableClickToCopy: true,
            // filterVariant: "autocomplete",
            size: 200,
          },
        ],
      },
      // Status
      {
        id: "status", //id used to define `group` column
        header: "Status",
        columns: [
          {
            accessorKey: "status", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Status",
            size: 250,
          },
        ],
      },
      //View Buttons
      {
        id: "buttons",
        header: "Buttons",
        minSize: 550,
        Cell: ({ row }) => {
          const candidate = row.original;
          // console.log("candidateData", candidate);

          return (
            <div
              className=""
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                overflow: "visible",
                padding: "4px",
              }}
            >
              <CandidateHistory candidateId={candidate.id} />
              <ChangeStatus
                candidateId={candidate.id}
                jobApplicantId={candidate.jobApplicantId}
                jobId={candidate.jobId}
              />
              <PreviewResume resume={candidate.resume} />
            </div>
          );
        },
      },
    ],
    []
  );

  //optionally access the underlying virtualizer instance
  const rowVirtualizerInstanceRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [filteredRowCount, setFilteredRowCount] = useState(0); // Track filtered rows
  const { selectedCandidates, setSelectedCandidates } = useCandidates();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  useEffect(() => {
    if (typeof window !== "undefined") {
      //  console.log("Updated Data:", data); // Check data passed to the component
      setTableData(data);
      setFilteredRowCount(data.length);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    //scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);

  const table = useMaterialReactTable({
    columns,
    data: tableData, //10,000 rows
    enableBottomToolbar: true,
    enableGlobalFilterModes: true,
    // enableColumnOrdering: true,
    // enableGrouping: true,
    enableColumnFilterModes: true,
    enableColumnPinning: true,
    enableRowSelection: true,
    // enableRowActions: true,
    enableFacetedValues: true,
    enablePagination: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    paginationDisplayMode: "pages",
    enableRowNumbers: true,
    enableRowVirtualization: true,
    onSortingChange: setSorting,
    rowVirtualizerInstanceRef, //optional
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    muiTableContainerProps: {
      sx: { maxHeight: "1000px", border: "2px solid rgba(81, 81, 81, .5)" },
    },
    muiTableBodyProps: {
      sx: {
        //stripe the rows, make odd rows a darker color
        "& tr:nth-of-type(odd) > td": {
          backgroundColor: "#f5f5f7",
        },
        "& td:nth-of-type(odd)": {
          backgroundColor: "#f5f5f5",
        },
      },
    },
    muiTablePaperProps: {
      elevation: 0, //change the mui box shadow
      //customize paper styles
      sx: {
        borderRadius: "0",
        border: "1px dashed #e0e0e0",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
        gap: 4,
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
        borderRight: "2px solid #e0e0e0", //add a border between columns
      },
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 20, 50, 100, 500, 1000],
      shape: "rounded",
      variant: "outlined",
    },
    positionToolbarAlertBanner: "bottom",
    state: { isLoading, sorting },
    onSortingChange: setSorting,
    initialState: {
      isFullScreen: false,
      showColumnFilters: true,
      showGlobalFilter: true,
      density: "compact",
      hoveredRow: true,
      columnPinning: {
        left: ["mrt-row-select"],
        // right: ["mrt-row-actions"],
      },
    },
  });

  const selectedDataMail = table
    .getSelectedRowModel()
    .rows.map((row, index) => {
      const { id, original } = row; // Destructure the row object to get 'id' and 'original'
      // const candidates = original; // Destructure the 'original' object to extract the desired fields
      return original;
    });
  // console.log(selectedDataMail);
  const handleSendMail = () => {
    setSelectedCandidates(selectedDataMail);
    router.push("/dashboard/mails");
  };

  return (
    <>
      {/*  Bulk Mail Send Button */}
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        {/* Send Mail */}
        {table.getIsSomeRowsSelected() || table.getIsAllRowsSelected() ? (
          <button
            onClick={handleSendMail}
            className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center gap-2"
          >
            <MailIcon />
            Send Mail
            <BottomGradient />
          </button>
        ) : (
          <button className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] opacity-50 cursor-not-allowed flex items-center justify-center gap-2">
            <MailIcon />
            Send Mail
            <BottomGradient />
          </button>
        )}
      </Box>
      <MaterialReactTable table={table} />
    </>
  );
};

const ApplicantsMasterTable = ({ data }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Example data={data} />
  </LocalizationProvider>
);

export default ApplicantsMasterTable;
