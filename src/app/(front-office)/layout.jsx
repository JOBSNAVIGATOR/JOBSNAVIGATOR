import Footer from "@/components/frontOffice/Footer";
import Navbar from "@/components/frontOffice/Navbar";
import React from "react";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="mt-20 min-h-screen bg-slate-300 dark:bg-transparent">{children}</div>
      <Footer />
    </div>
  );
}
