import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params;
  console.log("delete id is selected", id);

  try {
    // Check if company exists
    console.log("1");

    const existingCompany = await db.company.findUnique({
      where: { id },
    });
    console.log("2");

    if (!existingCompany) {
      return NextResponse.json(
        {
          error: "Company not found",
        },
        { status: 404 }
      );
    }

    // Delete the event from the database
    await db.company.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to delete Company",
        error,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, companyName, companyDescription, companyLogo } =
      await request.json();

    const company = await db.company.findUnique({
      where: {
        id,
      },
    });
    if (!company) {
      return NextResponse.json(
        {
          data: null,
          message: "No Company Found, Please Create One",
        },
        { status: 404 }
      );
    }

    const updatedCompany = await db.company.update({
      where: {
        id,
      },
      data: {
        companyName,
        companyDescription,
        companyLogo,
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Update Company",
        error,
      },
      { status: 500 }
    );
  }
}
