// "use client";
// import React from "react";
// import * as XLSX from "xlsx";

// const DownloadExcel = ({ data, fileName }) => {
//   const handleDownload = () => {
//     // Create a worksheet from the data
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, fileName);

//     // Generate the Excel file
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     // Create a blob and download the file
//     const blob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = fileName;
//     link.click();

//     URL.revokeObjectURL(url);
//   };

//   return (
//     <button
//       onClick={handleDownload}
//       className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
//     >
//       Download Excel
//     </button>
//   );
// };

// export default DownloadExcel;

// "use client";
// import React from "react";
// import * as XLSX from "xlsx"; // XLSX is still used to convert JSON to CSV

// const DownloadCSV = ({ data, fileName }) => {
//   const handleDownload = () => {
//     // Convert JSON data to CSV using XLSX
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const csv = XLSX.utils.sheet_to_csv(worksheet);

//     // Create a blob for the CSV data
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     // Create an anchor element to trigger the download
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `${fileName}.csv`; // Set the file extension to .csv
//     link.click();

//     // Clean up the object URL
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <button
//       onClick={handleDownload}
//       className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
//     >
//       Download CSV
//     </button>
//   );
// };

// export default DownloadCSV;

"use client";
import React from "react";
import * as XLSX from "xlsx";

const DownloadCSV = ({ data, fileName }) => {
  const handleDownload = () => {
    console.log("Data for CSV download:", data);
    // Make sure data is in an array of objects format
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid data format");
      return;
    }

    // Ensure clean data for CSV
    const cleanData = data.map((row) => {
      // Remove any undefined or null values
      const cleanedRow = {};
      for (let key in row) {
        if (row[key] !== undefined && row[key] !== null) {
          cleanedRow[key] = row[key];
        }
      }
      return cleanedRow;
    });

    // Convert JSON data to CSV using XLSX
    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    // Create a blob for the CSV data
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create an anchor element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.csv`; // Set the file extension to .csv
    link.click();

    // Clean up the object URL
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
    >
      Download CSV
    </button>
  );
};

export default DownloadCSV;
