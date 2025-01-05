"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Box, Button, lighten, ListItemIcon, MenuItem } from "@mui/material";
import { AccountCircle, Send } from "@mui/icons-material";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";

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
            size: 200,
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
            accessorKey: "curretCtc", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
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
            accessorFn: (row) => new Date(row.mailSentDate), //convert to Date for sorting and filtering
            // accessorKey: 'Date_Of_Birth', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            filterVariant: "date",
            header: "Mail Sent Date",
            sortingFn: "datetime",
            Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
            size: 240,
            // enableClickToCopy: true,
            // filterVariant: 'autocomplete',
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
    paginationDisplayMode: "pages",
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 20, 50, 100, 500, 1000],
      shape: "rounded",
      variant: "outlined",
    },
    positionToolbarAlertBanner: "bottom",
    // muiSearchTextFieldProps: {
    //   size: "small",
    //   variant: "outlined",
    // },
    // state: { isLoading },
    state: { isLoading, sorting },
    onSortingChange: setSorting,
    // onStateChange: () => {
    //   // Update the filtered row count whenever the table state changes
    //   const filteredRows = table.getFilteredRowModel().rows;
    //   setFilteredRowCount(filteredRows.length);
    // },
    initialState: {
      isFullScreen: false,
      showColumnFilters: true,
      showGlobalFilter: true,
      density: "compact",
    },
    enableRowNumbers: true,
    enableRowVirtualization: true,

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

    onSortingChange: setSorting,
    rowVirtualizerInstanceRef, //optional
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    renderRowActionMenuItems: ({ closeMenu }) => [
      <MenuItem
        key={0}
        onClick={() => {
          // View profile logic...
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        Edit Candidate
      </MenuItem>,
      <MenuItem
        key={1}
        onClick={() => {
          // Send email logic...
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Send />
        </ListItemIcon>
        Delete Candidate
      </MenuItem>,
    ],
    renderTopToolbar: ({ table }) => {
      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("activating " + row.getValue("name"));
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("contact " + row.getValue("name"));
        });
      };

      return (
        <Box
          sx={(theme) => ({
            backgroundColor: lighten(theme.palette.background.default, 0.05),
            display: "flex",
            gap: "0.5rem",
            p: "8px",
            justifyContent: "space-between",
          })}
        >
          <Box
            sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          ></Box>
          <Box>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                color="success"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleActivate}
                variant="contained"
              >
                Bulk Download
              </Button>
              <Button
                color="info"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleContact}
                variant="contained"
              >
                Send Mail
              </Button>
            </Box>
          </Box>
        </Box>
      );
    },
  });

  // Update filtered row count whenever filters or global filter change
  useEffect(() => {
    const filteredRows = table.getFilteredRowModel().rows;
    setFilteredRowCount(filteredRows.length);
  }, [table.getState().columnFilters, table.getState().globalFilter]);

  return (
    <>
      {/* <div>
        <strong>Filtered Row Count: {filteredRowCount}</strong>
      </div>
      <MaterialReactTable table={table} /> */}

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
