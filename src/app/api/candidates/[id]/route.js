// src/app/api/activities/[id]/route.js
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params;
  console.log(id);

  try {
    // Check if event exists
    const existingUser = await db.candidateProfile.findUnique({
      where: { id },
      include: { user: true },
    });
    // console.log("existing user", existingUser?.user?.id);
    const existingUserId = existingUser?.user?.id;

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Delete the event from the database
    await db.user.delete({
      where: { id: existingUserId },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to delete event",
        error,
      },
      { status: 500 }
    );
  }
}
