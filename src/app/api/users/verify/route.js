import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { token, id } = await request.json();
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          data: null,
          message: "No User Found",
        },
        { status: 404 }
      );
    }
    // const now = new Date();
    // const formattedDate = `${now.getFullYear()}-${String(
    //   now.getMonth() + 1
    // ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
    //   now.getHours()
    // ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
    //   now.getSeconds()
    // ).padStart(2, "0")}`;
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        emailVerified: true,
        verificationRequestCount: parseInt(user.verificationRequestCount) + 1,
        emailVerifiedDate: new Date(),
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Update User",
        error,
      },
      { status: 500 }
    );
  }
}
