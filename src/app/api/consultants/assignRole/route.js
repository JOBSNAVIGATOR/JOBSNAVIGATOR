import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { id, roleId } = await request.json();
    console.log("entereddddddd");

    // Validate inputs
    if (!id || !roleId) {
      return NextResponse.json(
        { message: "Missing required fields: id and roleId" },
        { status: 400 }
      );
    }

    // Check if consultant exists
    const existingConsultant = await db.consultantProfile.findUnique({
      where: { id },
    });

    if (!existingConsultant) {
      return NextResponse.json(
        { message: "Consultant Not Found" },
        { status: 404 }
      );
    }

    // Check if the role exists
    const existingRole = await db.role.findUnique({
      where: { id: roleId },
    });

    if (!existingRole) {
      return NextResponse.json(
        { message: "Invalid Role ID: Role Not Found" },
        { status: 400 }
      );
    }

    // Update consultant's role
    await db.consultantProfile.update({
      where: { id },
      data: {
        role: {
          connect: { id: roleId }, // ✅ Correct way to assign role
        },
      },
    });

    return NextResponse.json(
      { message: "Role Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning role:", error);
    return NextResponse.json(
      { error: error.message, message: "Server Error: Something went wrong" },
      { status: 500 }
    );
  }
}
