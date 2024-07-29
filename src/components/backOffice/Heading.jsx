import React from "react";

export default function Heading({ title }) {
  return (
    <h2 className="text-3xl font-semibold dark:text-slate-50 text-slate-800 text-center">
      {title}
    </h2>
  );
}
