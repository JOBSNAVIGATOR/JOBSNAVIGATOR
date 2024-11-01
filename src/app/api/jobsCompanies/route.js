import db from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET(req) {
  try {
    // Fetch all jobs from the candidate profile
    const jobs = await db.job.findMany({
      include: {
        jobApplicants: true, // Include candidateProfile if it's related to user
        jobCompany: true,
      },
    });

    return new Response(JSON.stringify(jobs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch jobs", error }),
      { status: 500 }
    );
  }
}
