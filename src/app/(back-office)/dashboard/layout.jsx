"use client";
import Navbar from "@/components/backOffice/Navbar";
import Sidebar from "@/components/backOffice/Sidebar";
import React, { useState } from "react";

export default function Layout({ children }) {
  const [showSideBar, setShowSideBar] = useState(false);
  return (
    <div>
      <Navbar showSideBar={showSideBar} setShowSideBar={setShowSideBar} />
      <Sidebar showSideBar={showSideBar} setShowSideBar={setShowSideBar} />

      <div className="min-h-screen p-4 sm:ml-64 mt-16">{children}</div>
    </div>
  );
}
