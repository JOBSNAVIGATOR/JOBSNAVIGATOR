import FormHeader from "@/components/backOffice/FormHeader";
import SectorForm from "@/components/backOffice/forms/SectorForm";

import db from "@/lib/db";
import React from "react";

export default async function UpdateTag({ params: { id } }) {
  const sector = await db.sector.findUnique({
    where: { id },
    include: { domains: true },
  });

  if (!sector) {
    return NextResponse.json({ message: "Sector not found" }, { status: 404 });
  }
  return (
    <div>
      <FormHeader title="Update Sector" />
      <SectorForm updateData={sector} />
    </div>
  );
}
