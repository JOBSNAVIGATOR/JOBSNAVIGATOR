import React from "react";

export default function PreviewResume({ resume }) {
  // Check if resume is null or undefined
  const isResumeNull = !resume;
  const handlePreview = () => {
    if (!isResumeNull) {
      try {
        const blob = base64ToBlob(resume); // Convert Base64 to Blob
        const url = URL.createObjectURL(blob); // Create an object URL
        window.open(url); // Open the URL in a new tab or window
      } catch (error) {
        console.error("Error previewing the resume:", error);
      }
    }
  };
  const base64ToBlob = (base64, type = "application/pdf") => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    return new Blob([byteNumbers], { type });
  };
  return (
    <button
      onClick={handlePreview}
      disabled={isResumeNull} // Disable the button if `resume` is null
      className={`relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group ${
        isResumeNull
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white"
      } dark:text-white focus:ring-4 focus:outline-none ${
        isResumeNull
          ? "focus:ring-gray-300"
          : "focus:ring-blue-300 dark:focus:ring-blue-800"
      }`}
    >
      <span
        className={`relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md ${
          isResumeNull ? "" : "group-hover:bg-opacity-0"
        }`}
      >
        {isResumeNull ? "No Resume" : "Preview"}
      </span>
    </button>
  );
}
