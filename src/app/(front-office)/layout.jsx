import Footer from "@/components/frontOffice/Footer";
import React from "react";

export default function Layout({ children }) {
  return (
    <div>
      {/* <Navbar /> */}
      <div className="">{children}</div>
      <Footer />
    </div>
  );
}
