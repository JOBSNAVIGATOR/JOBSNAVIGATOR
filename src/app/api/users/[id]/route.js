import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  // console.log("check", id);
  try {
    // console.log("check4");
    const user = await db.user.findUnique({
      where: {
        id,
      },
      include: {
        candidateProfile: true, // Include candidateProfile if it's related to user
      },
    });
    // console.log("check5", user);
    return NextResponse.json(user);
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch User",
        error,
      },
      { status: 500 }
    );
  }
}
