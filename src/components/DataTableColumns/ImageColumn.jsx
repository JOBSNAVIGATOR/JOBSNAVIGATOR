import Image from "next/image";
import React from "react";

export default function ImageColumn({ row, accessorKey }) {
  const imageUrl = row.getValue(`${accessorKey}`);
  return (
    <Image
      src={imageUrl}
      width={500}
      height={500}
      alt={`${accessorKey}`}
      className=" w-12 h-12 rounded-full object-cover"
    />
  );
}
