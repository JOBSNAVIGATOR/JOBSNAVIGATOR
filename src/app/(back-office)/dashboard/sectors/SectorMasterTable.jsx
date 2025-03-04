"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ListItemIcon, MenuItem } from "@mui/material";
import { AccountCircle, Delete, Send } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Briefcase, MailIcon, Tag } from "lucide-react";

const Example = ({ data, canEditSector, canDeleteSector }) => {
  const columns = useMemo(
    () => [
      // cmpany Details
      {
        id: "sectorDetails", //id used to define `group` column
        header: "sectorDetails",
        columns: [
          {
            accessorKey: "sectorName", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Sector Name",
            size: 400,
          },
          {
            accessorKey: "domains", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            // filterVariant: "autocomplete",
            header: "Domains",
            size: 400,
            Cell: ({ row }) => {
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
        ],
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
    // enableRowSelection: true,
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
      hoveredRow: true,
      columnPinning: {
        left: ["mrt-row-select"],
        right: ["mrt-row-actions"],
      },
    },

    renderRowActionMenuItems: ({ closeMenu, row }) =>
      [
        canEditSector && (
          <MenuItem key="edit" onClick={closeMenu} sx={{ m: 0 }}>
            <Link
              href={`${baseUrl}/dashboard/sectors/update/${row.original.id}`}
              className="flex items-center"
            >
              <ListItemIcon>
                <Briefcase />
              </ListItemIcon>
              Edit Sector
            </Link>
          </MenuItem>
        ),
        canDeleteSector && (
          <MenuItem
            key="delete"
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  const res = await fetch(
                    `${baseUrl}/api/sectors/${row.original.id}`,
                    {
                      method: "DELETE",
                    }
                  );

                  if (res.ok) {
                    router.refresh();
                    toast.success("Sector Deleted Successfully");
                  }
                }
              });

              closeMenu();
            }}
            sx={{ m: 0 }}
          >
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            Delete Sector
          </MenuItem>
        ),
      ].filter(Boolean), // Remove `false` or `undefined` values from the array
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

const SectorMasterTable = ({ data, canEditSector, canDeleteSector }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Example
      data={data}
      canEditSector={canEditSector}
      canDeleteSector={canDeleteSector}
    />
  </LocalizationProvider>
);

export default SectorMasterTable;
