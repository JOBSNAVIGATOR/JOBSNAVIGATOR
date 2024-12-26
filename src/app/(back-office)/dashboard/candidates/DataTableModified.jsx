"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";
import DownloadCSV from "@/components/backOffice/DownloadCsv";
import DataTableToolbar from "@/components/data-table-components/DataTableToolbar";
import DataTablePagination from "@/components/data-table-components/DataTablePagination";
import SendMailButton from "@/components/ui/SendMailButton";
import Link from "next/link";
import { BottomGradient } from "@/components/ui/BottomGradient";
import { useCandidates } from "@/context/CandidatesContext";
import { useRouter } from "next/navigation";

// export default function DataTable({ columns, data, filterKeys = ["title"] }) {
export default function DataTableModified({ columns, data, filterKeys = [] }) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const { selectedCandidates, setSelectedCandidates } = useCandidates();
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  const selectedDataCsv = table.getSelectedRowModel().rows.map((row, index) => {
    const { id, original } = row; // Destructure the row object to get 'id' and 'original'
    const {
      candidateCode,
      name,
      email,
      currentCompany,
      currentJobLocation,
      currentCtc,
    } = original; // Destructure the 'original' object to extract the desired fields
    return {
      srNo: index + 1, // Add serial number starting from 1
      candidateCode,
      name,
      email,
      currentCompany,
      currentJobLocation,
      currentCtc,
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
    <div className="space-y-4">
      <div className="flex justify-end gap-4">
        <DownloadCSV data={selectedDataCsv} fileName="candidates" />
        <button
          onClick={handleSendMail}
          className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        >
          Send Mail
          <BottomGradient />
        </button>
      </div>
      {/* Contain filter and view */}
      <DataTableToolbar table={table} filterKeys={filterKeys} />
      {/* contain Actual Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
}
