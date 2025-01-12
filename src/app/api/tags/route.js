import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    //extract the credentials
    const { name, description, createdByName, createdById } =
      await request.json();
    //Check if the user Already exists in the db
    const existingTag = await db.tag.findUnique({
      where: {
        name,
      },
    });
    if (existingTag) {
      return NextResponse.json(
        {
          data: null,
          message: `Tag with this Name ( ${name})  already exists in the Database`,
        },
        { status: 409 }
      );
    }

    const newTag = await db.tag.create({
      data: {
        name,
        description,
        createdById,
        createdByName,
      },
    });

    return NextResponse.json(
      {
        data: newTag,
        message: "Tag Created Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Server Error: Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Fetch all companies from the candidate profile
    const tags = await db.tag.findMany({});

    return new Response(JSON.stringify(tags), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // console.error("Error fetching tags:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch tags", error }),
      { status: 500 }
    );
  }
}
