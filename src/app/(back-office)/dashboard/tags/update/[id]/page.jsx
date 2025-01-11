import FormHeader from "@/components/backOffice/FormHeader";
import TagForm from "@/components/backOffice/forms/TagForm";
import db from "@/lib/db";
import React from "react";

export default async function UpdateTag({ params: { id } }) {
  const tag = await db.tag.findUnique({
    where: { id },
  });

  if (!tag) {
    return NextResponse.json({ message: "Tag not found" }, { status: 404 });
  }
  return (
    <div>
      <FormHeader title="Update Tag" />
      <TagForm updateData={tag} />
    </div>
  );
}
