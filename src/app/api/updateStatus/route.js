import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { id, status } = await request.json();
    // console.log("backend", id, status);

    const jobApplicantData = await db.jobApplicant.findUnique({
      where: {
        id,
      },
    });
    if (!jobApplicantData) {
      return NextResponse.json(
        {
          data: null,
          message: "No Applicant Profile Found, Please Create One",
        },
        { status: 404 }
      );
    }

    const updatedJobApplicantData = await db.jobApplicant.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedJobApplicantData);
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Update Status",
        error,
      },
      { status: 500 }
    );
  }
}
