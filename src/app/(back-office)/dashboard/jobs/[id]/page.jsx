import React from "react";

export default function Page({ params }) {
  const jobId = params.id;
  return (
    <div>
      <h2>Specific Job</h2>
      <h3>{jobId}</h3>
    </div>
  );
}
