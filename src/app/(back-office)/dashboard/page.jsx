import AdminDashboard from "@/components/backOffice/AdminDashboard";
import ConsultantDashboard from "@/components/backOffice/ConsultantDashboard";
import Heading from "@/components/backOffice/Heading";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const role = session?.user?.role;
  // const role = "ADMIN";
  if (role === "ADMIN") {
    return <AdminDashboard />;
  }
  if (role === "CONSULTANT") {
    return <ConsultantDashboard />;
  }

  return (
    <div>
      <Heading title={"General Dashboard"} />
    </div>
  );
}
