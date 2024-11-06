import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    //extract the credentials
    const { companyName, companyDescription, companyLogo } =
      await request.json();
    //Check if the user Already exists in the db
    const existingCompany = await db.company.findUnique({
      where: {
        companyName,
      },
    });
    if (existingCompany) {
      return NextResponse.json(
        {
          data: null,
          message: `Company with this Name ( ${companyName})  already exists in the Database`,
        },
        { status: 409 }
      );
    }

    const newCompany = await db.company.create({
      data: {
        companyName,
        companyDescription,
        companyLogo,
      },
    });

    return NextResponse.json(
      {
        data: newCompany,
        message: "Company Created Successfully",
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
    const companies = await db.company.findMany({});

    return new Response(JSON.stringify(companies), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // console.error("Error fetching companies:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch companies", error }),
      { status: 500 }
    );
  }
}
