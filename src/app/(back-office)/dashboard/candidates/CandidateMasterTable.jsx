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
import { AccountCircle, Send } from "@mui/icons-material";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import DownloadCSV from "@/components/backOffice/DownloadCsv";
import { BottomGradient } from "@/components/ui/BottomGradient";
import { useCandidates } from "@/context/CandidatesContext";
import { useRouter } from "next/navigation";

const Example = ({ data }) => {
  const columns = useMemo(
    () => [
      // Application Details
      {
        id: "candidateCode", //id used to define `group` column
        header: "Candidate Code",
        columns: [
          {
            accessorKey: "candidateCode", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            // enableClickToCopy: true,
            // filterVariant: "autocomplete",
            header: "Basic Id",
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
          // {
          //   accessorFn: (row) => `${row.Name}`, //accessorFn used to join multiple data into a single cell
          //   id: 'name', //id is still required when using accessorFn instead of accessorKey
          //   header: 'Name',
          //   size: 250,
          // },
          {
            accessorKey: "gender", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            // enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Gender",
            size: 200,
          },
          //   {
          //     accessorFn: (row) => new Date(row.Date_Of_Birth), //convert to Date for sorting and filtering
          //     // accessorKey: 'Date_Of_Birth', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
          //     filterVariant: "date",
          //     header: "DOB",
          //     sortingFn: "datetime",
          //     Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
          //     size: 240,
          //     // enableClickToCopy: true,
          //     // filterVariant: 'autocomplete',
          //   },
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
          {
            accessorKey: "emergencyContactNumber", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            // enableClickToCopy: true,
            // filterVariant: "autocomplete",
            header: "Alternate Contact Number",
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
            accessorKey: "sector", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: "Sector",
            filterVariant: "autocomplete",
            size: 250,
          },
          {
            accessorKey: "domain", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: "Domain",
            // enableClickToCopy: true,
            filterVariant: "autocomplete",
            size: 200,
          },
          {
            accessorKey: "designation", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: "Designation",
            // enableClickToCopy: true,
            filterVariant: "autocomplete",
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
            accessorKey: "currentCompany", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: "Current Company",
            // enableClickToCopy: true,
            filterVariant: "autocomplete",
            size: 200,
          },
          {
            accessorKey: "currentJobLocation", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: "Current Job Location",
            // enableClickToCopy: true,
            filterVariant: "autocomplete",
            size: 250,
          },
          {
            accessorKey: "totalWorkingExperience", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: "Total Working Experience",
            // enableClickToCopy: true,
            // filterVariant: "autocomplete",
            size: 200,
          },
          {
            accessorKey: "previousCompanyName", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            // enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Previous Companies Name",
            size: 200,
          },
        ],
      },
      // Education Details
      {
        id: "educationDetails",
        header: "Education Details",
        columns: [
          {
            accessorKey: "degree",
            header: "Degree",
            filterVariant: "autocomplete",
            size: 200,
          },
          {
            accessorKey: "collegeName",
            header: "College Name",
            filterVariant: "autocomplete",
            size: 200,
          },
          {
            accessorKey: "graduationYear",
            header: "Graduation Year",
            filterVariant: "autocomplete",
            size: 200,
          },
          {
            accessorKey: "skills",
            header: "Skills",
            // filterVariant: "autocomplete",
            size: 400,
          },
        ],
      },
      // Communication Details
      {
        id: "communicationDetails",
        header: "Communication Details",
        columns: [
          {
            accessorKey: "mailSent",
            header: "Mail Sent",
            //   filterVariant: "autocomplete",
            size: 200,

            cell: ({ getValue }) => {
              const value = getValue(); // Correctly get the value
              console.log("Value of mailSent:", value); // Check the value
              if (value === undefined || value === null) {
                return "No Data"; // Display a placeholder if value is missing
              }

              return value ? "Yes" : "No";
            },
          },
          {
            accessorFn: (row) =>
              row.mailSentDate ? new Date(row.mailSentDate) : null, // Convert to Date or null
            filterVariant: "date",
            header: "Mail Sent Date",
            sortingFn: "datetime",
            Cell: ({ cell }) => {
              const value = cell.getValue();
              if (value) {
                // Format the date as DD-MM-YYYY
                const day = String(value.getDate()).padStart(2, "0");
                const month = String(value.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-based
                const year = value.getFullYear();

                // Format the time as HH:MM AM/PM
                let hours = value.getHours();
                const minutes = String(value.getMinutes()).padStart(2, "0");
                const ampm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12; // Convert to 12-hour format
                hours = hours ? hours : 12; // Handle midnight case
                const formattedTime = `${hours}:${minutes} ${ampm}`;

                // Combine date and time
                const formattedDate = `${day}-${month}-${year} ${formattedTime}`;
                return formattedDate;
              } else {
                return "N/A"; // Handle null gracefully
              }
            },
            size: 240,
          },
          {
            accessorKey: "mailSubject",
            header: "Mail Subject",
            // filterVariant: 'autocomplete',
            size: 200,
          },
          {
            accessorKey: "mailTemplateName",
            header: "Mail Template Name",
            filterVariant: "autocomplete",
            size: 200,
          },
          {
            accessorKey: "mailSender",
            header: "Mail Sender",
            filterVariant: "autocomplete",
            size: 200,
          },
        ],
      },
      // Status
      //   {
      //     id: "Status",
      //     header: "Status",
      //     columns: [
      //       {
      //         accessorKey: "Interview_Status",
      //         header: "Interview_Status",
      //         filterVariant: "autocomplete",
      //         size: 300,
      //       },
      //     ],
      //   },
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
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnFilterModes: true,
    enableColumnPinning: true,
    enableRowSelection: true,
    enableRowActions: true,
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
    },

    // renderRowActionMenuItems: ({ closeMenu }) => [
    //   <MenuItem
    //     key={0}
    //     onClick={() => {
    //       // View profile logic...
    //       closeMenu();
    //     }}
    //     sx={{ m: 0 }}
    //   >
    //     <ListItemIcon>
    //       <AccountCircle />
    //     </ListItemIcon>
    //     Edit Candidate
    //   </MenuItem>,
    //   <MenuItem
    //     key={1}
    //     onClick={() => {
    //       // Send email logic...
    //       closeMenu();
    //     }}
    //     sx={{ m: 0 }}
    //   >
    //     <ListItemIcon>
    //       <Send />
    //     </ListItemIcon>
    //     Delete Candidate
    //   </MenuItem>,
    // ],
    // renderTopToolbar: ({ table }) => {
    //   const handleActivate = () => {
    //     table.getSelectedRowModel().flatRows.map((row) => {
    //       alert("activating " + row.getValue("name"));
    //     });
    //   };

    //   const handleContact = () => {
    //     table.getSelectedRowModel().flatRows.map((row) => {
    //       alert("contact " + row.getValue("name"));
    //     });
    //   };

    //   return (
    //     <Box
    //       sx={(theme) => ({
    //         backgroundColor: lighten(theme.palette.background.default, 0.05),
    //         display: "flex",
    //         gap: "0.5rem",
    //         p: "8px",
    //         justifyContent: "space-between",
    //       })}
    //     >
    //       <Box
    //         sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
    //       ></Box>
    //       <Box>
    //         <Box sx={{ display: "flex", gap: "0.5rem" }}>
    //           <Button
    //             color="success"
    //             disabled={!table.getIsSomeRowsSelected()}
    //             onClick={handleActivate}
    //             variant="contained"
    //           >
    //             Bulk Download
    //           </Button>
    //           <Button
    //             color="info"
    //             disabled={!table.getIsSomeRowsSelected()}
    //             onClick={handleContact}
    //             variant="contained"
    //           >
    //             Send Mail
    //           </Button>
    //         </Box>
    //       </Box>
    //     </Box>
    //   );
    // },
  });

  // Update filtered row count whenever filters or global filter change
  useEffect(() => {
    const filteredRows = table.getFilteredRowModel().rows;
    setFilteredRowCount(filteredRows.length);
  }, [table.getState().columnFilters, table.getState().globalFilter]);

  const selectedDataCsv = table.getSelectedRowModel().rows.map((row, index) => {
    const { id, original } = row; // Destructure the row object to get 'id' and 'original'
    const {
      candidateCode,
      name,
      gender,
      email,
      contactNumber,
      emergencyContactNumber,
      sector,
      domain,
      designation,
      currentCtc,
      currentCompany,
      currentJobLocation,
      totalWorkingExperience,
      previousCompanyName,
      degree,
      collegeName,
      graduationYear,
      skills,
    } = original; // Destructure the 'original' object to extract the desired fields
    return {
      srNo: index + 1, // Add serial number starting from 1
      candidateCode,
      name,
      gender,
      email,
      contactNumber,
      emergencyContactNumber,
      sector,
      domain,
      designation,
      currentCtc,
      currentCompany,
      currentJobLocation,
      totalWorkingExperience,
      previousCompanyName,
      degree,
      collegeName,
      graduationYear,
      skills,
    };
  });

  const allDataCsv = table.getRowModel().rows.map((row, index) => {
    const { id, original } = row; // Destructure the row object to get 'id' and 'original'
    const {
      candidateCode,
      name,
      gender,
      email,
      contactNumber,
      emergencyContactNumber,
      sector,
      domain,
      designation,
      currentCtc,
      currentCompany,
      currentJobLocation,
      totalWorkingExperience,
      previousCompanyName,
      degree,
      collegeName,
      graduationYear,
      skills,
    } = original; // Destructure the 'original' object to extract the desired fields
    return {
      srNo: index + 1, // Add serial number starting from 1
      candidateCode,
      name,
      gender,
      email,
      contactNumber,
      emergencyContactNumber,
      sector,
      domain,
      designation,
      currentCtc,
      currentCompany,
      currentJobLocation,
      totalWorkingExperience,
      previousCompanyName,
      degree,
      collegeName,
      graduationYear,
      skills,
    };
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
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <DownloadCSV
          title="Export Page Rows"
          fileName="pageCandidates"
          data={allDataCsv}
        />
        {table.getIsSomeRowsSelected() || table.getIsAllRowsSelected() ? (
          <DownloadCSV
            title="Export Selected Rows"
            fileName="selectedCandidates"
            data={selectedDataCsv}
          />
        ) : (
          <button className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] opacity-50 cursor-not-allowed">
            Export Selected Rows
            <BottomGradient />
          </button>
        )}
        {table.getIsSomeRowsSelected() || table.getIsAllRowsSelected() ? (
          <button
            onClick={handleSendMail}
            className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          >
            Send Mail
            <BottomGradient />
          </button>
        ) : (
          <button className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] opacity-50 cursor-not-allowed">
            Send Mail
            <BottomGradient />
          </button>
        )}
      </Box>
      <MaterialReactTable table={table} />
    </>
  );
};

const CandidateMasterTable = ({ data }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Example data={data} />
  </LocalizationProvider>
);

export default CandidateMasterTable;
