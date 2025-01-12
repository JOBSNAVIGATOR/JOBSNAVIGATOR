import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params;
  // console.log("delete id is selected", id);

  try {
    // Check if company exists
    // console.log("1");

    const existingTag = await db.tag.findUnique({
      where: { id },
    });
    // console.log("2");

    if (!existingTag) {
      return NextResponse.json(
        {
          error: "Tag not found",
        },
        { status: 404 }
      );
    }

    // Delete the event from the database
    await db.tag.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Tag deleted successfully",
    });
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        message: "Failed to delete Tag",
        error,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, name, description, updatedByName, updatedById } =
      await request.json();

    const tag = await db.tag.findUnique({
      where: {
        id,
      },
    });
    if (!tag) {
      return NextResponse.json(
        {
          data: null,
          message: "No Tag Found, Please Create One",
        },
        { status: 404 }
      );
    }

    const updatedTag = await db.tag.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        updatedByName,
      },
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Update Tag",
        error,
      },
      { status: 500 }
    );
  }
}
