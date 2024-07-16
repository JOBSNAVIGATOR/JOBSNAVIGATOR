import Navbar from "@/components/backOffice/Navbar";
import Sidebar from "@/components/backOffice/Sidebar";
import React from "react";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <Sidebar />

      <div className="">{children}</div>
    </div>
  );
}
