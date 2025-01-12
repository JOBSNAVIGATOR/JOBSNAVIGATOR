import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    //extract the credentials
    const { name, description, createdByName, createdById } =
      await request.json();

    // Validate input fields
    if (!name || !description || !createdById) {
      return NextResponse.json(
        { message: "Name, description, and createdById are required." },
        { status: 400 }
      );
    }

    //Check if the tag Already exists in the db with same name and createdById
    const existingTag = await db.tag.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        createdById,
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
    // catch (error) {
    //   console.error("Error creating tag:", error);

    //   return NextResponse.json(
    //     {
    //       error,
    //       message: "Server Error: Something went wrong",
    //     },
    //     { status: 500 }
    //   );
    // }
    console.error("Error creating tag:", error);

    // Detailed error handling
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Known Prisma error (e.g., duplicate unique constraint violation)
      return NextResponse.json(
        {
          message: `Prisma error: ${error.message}`,
          details: error.meta,
        },
        { status: 500 }
      );
    } else {
      // Generic error
      return NextResponse.json(
        {
          message: "Server error: Something went wrong",
          error: error.message,
        },
        { status: 500 }
      );
    }
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }
    const { user } = session;
    const { role, id: userId } = user;

    // Filter tags based on role
    let tags;
    if (role === "ADMIN") {
      tags = await db.tag.findMany(); // Fetch all tags for admin
    } else if (role === "CONSULTANT") {
      tags = await db.tag.findMany({
        where: { createdById: userId }, // Fetch only consultant's tags
      });
    } else {
      return NextResponse.json(
        { message: "Role not allowed to fetch tags" },
        { status: 403 }
      );
    }

    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    // console.error("Error fetching tags:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch tags", error }),
      { status: 500 }
    );
  }
}
