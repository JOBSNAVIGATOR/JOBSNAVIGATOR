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
import { Tag } from "lucide-react";

const Example = ({ data }) => {
  const columns = useMemo(
    () => [
      // Application Details
      {
        id: "tagDetails", //id used to define `group` column
        header: "Tag Details",
        columns: [
          {
            accessorKey: "name",
            // enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Tag Name",
            size: 200,
          },
          {
            accessorKey: "description",
            // enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Tag Description",
            size: 200,
          },
          {
            accessorKey: "updatedByName",
            // enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Updated By",
            size: 200,
          },
          {
            accessorKey: "createdByName",
            // enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Created By",
            size: 200,
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
      hoveredRow: true,
      columnPinning: {
        left: ["mrt-row-select"],
        right: ["mrt-row-actions"],
      },
    },

    renderRowActionMenuItems: ({ closeMenu, row }) => [
      // Edit Tag
      <MenuItem
        key={0}
        onClick={() => {
          // Access candidate.id here
          // const candidate = row.original; // Get candidate.id from row.original
          closeMenu();
        }}
        sx={{ m: 0 }}

        // className="flex items-center justify-between"
      >
        <Link href={`${baseUrl}/dashboard/tags/update/${row.original.id}`}>
          <div className="flex items-center">
            <ListItemIcon>
              <Tag />
            </ListItemIcon>
            Edit Tag
          </div>
        </Link>
      </MenuItem>,
      // Delete Tag
      <MenuItem
        key={1}
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
              // console.log("Yes have been clicked", endpoint);
              const res = await fetch(
                `${baseUrl}/api/tags/${row.original.id}`,
                {
                  method: "DELETE",
                }
              );
              // console.log(res);
              if (res.ok) {
                router.refresh();
                toast.success(`Tag Deleted Successfully`);
              }
            } else {
              // console.log("No has been clicked");
            }
          });
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <div className="flex items-center">
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          Delete Tag
        </div>
      </MenuItem>,
    ],
  });

  // Update filtered row count whenever filters or global filter change
  useEffect(() => {
    const filteredRows = table.getFilteredRowModel().rows;
    setFilteredRowCount(filteredRows.length);
  }, [table.getState().columnFilters, table.getState().globalFilter]);

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

const TagMasterTable = ({ data }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Example data={data} />
  </LocalizationProvider>
);

export default TagMasterTable;
