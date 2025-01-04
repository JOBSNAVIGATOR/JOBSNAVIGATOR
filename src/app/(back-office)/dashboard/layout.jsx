"use client";
import Navbar from "@/components/backOffice/Navbar";
import Sidebar from "@/components/backOffice/Sidebar";
import DeveloperFooter from "@/components/ui/DeveloperFooter";
import React, { useState } from "react";

export default function Layout({ children }) {
  const [showSideBar, setShowSideBar] = useState(false);
  return (
    <div>
      <Navbar showSideBar={showSideBar} setShowSideBar={setShowSideBar} />
      <Sidebar showSideBar={showSideBar} setShowSideBar={setShowSideBar} />

      <div className="min-h-screen p-4 sm:ml-64 mt-20 bg-slate-300 dark:bg-transparent">
        {children}
      </div>
      <div className="p-4 sm:ml-64 mt-0 ">
        <DeveloperFooter />
      </div>
    </div>
  );
}
