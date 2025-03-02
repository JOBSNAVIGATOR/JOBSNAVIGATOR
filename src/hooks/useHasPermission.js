"use client";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useHasPermission(permission) {
  // Fetch latest role & permissions
  const { data: updatedRole, mutate } = useSWR(
    "/api/consultants/roles",
    fetcher,
    {
      refreshInterval: 5000, // Refetch data every 5 seconds
    }
  );
  console.log("latestData", updatedRole);
  // 🔥 Fix: Handle case when `updatedRole` is undefined
  if (!updatedRole || !updatedRole.permissions) {
    return false; // Default to no permission if data is not yet loaded
  }

  return updatedRole.permissions.includes(permission);
}
