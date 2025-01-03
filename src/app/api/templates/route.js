import db from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET(req) {
  try {
    // Fetch all candidates from the candidate profile
    const templates = await db.emailTemplate.findMany();
    return NextResponse.json(
      { success: true, templatesData: templates },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch templates",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json(); // Parse request body
    const { name, subject, content } = body;

    const existingTemplate = await db.emailTemplate.findFirst({
      where: {
        name,
        subject,
        content,
      },
    });
    if (existingTemplate) {
      return NextResponse.json(
        {
          data: null,
          message: `Template with these details already exists in the Database`,
        },
        { status: 409 }
      );
    }

    // Create a new email template
    const newTemplate = await db.emailTemplate.create({
      data: { name, subject, content },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Template created successfully",
        data: newTemplate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create template, Due to Unique Template Name Constraint",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json(); // Parse request body
    const { id, name, subject, content } = body;
    const template = await db.emailTemplate.findUnique({
      where: {
        id,
      },
    });
    if (!template) {
      return NextResponse.json(
        {
          data: null,
          message: "No Template Found, Please Create One",
        },
        { status: 404 }
      );
    }

    // Update an existing email template
    const updatedTemplate = await db.emailTemplate.update({
      where: { id },
      data: { subject, content },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Template updated successfully",
        data: updatedTemplate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update template",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url); // Extract query params
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Template ID is required" },
        { status: 400 }
      );
    }

    // Delete the email template
    await db.emailTemplate.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Template deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete template",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
