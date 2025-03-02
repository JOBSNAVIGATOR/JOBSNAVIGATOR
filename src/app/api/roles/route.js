import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const roles = await db.role.findMany({}); // Fetch all sectors
    // console.log(roles);

    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    // console.error("Error fetching roles:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch roles", error }),
      { status: 500 }
    );
  }
}
