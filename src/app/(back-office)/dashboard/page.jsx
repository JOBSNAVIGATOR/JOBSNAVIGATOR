import AdminDashboard from "@/components/backOffice/AdminDashboard";
import ConsultantDashboard from "@/components/backOffice/ConsultantDashboard";
import Heading from "@/components/backOffice/Heading";
import React from "react";

export default function Dashboard() {
  // const session = await getServerSession(authOptions);
  // const role = session?.user?.role;
  const role = "ADMIN";
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
