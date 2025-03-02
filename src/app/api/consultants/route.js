import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";

export async function POST(request) {
  try {
    // Extract the credentials
    const defaultPassword = "jobsnvg123";
    const {
      name,
      email,
      role,
      contactNumber,
      gender,
      emergencyContactNumber,
      permanentAddress,
      currentAddress,
      joiningDate,
      isActive,
    } = await request.json();

    // Ensure joiningDate is valid ISO-8601 date
    const validJoiningDate = joiningDate
      ? new Date(joiningDate).toISOString()
      : null;

    if (!validJoiningDate) {
      return NextResponse.json(
        {
          data: null,
          message: "Invalid or missing joining date.",
        },
        { status: 400 }
      );
    }

    // Check if the user already exists in the db
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: `User with this email (${email}) already exists in the Database`,
        },
        { status: 409 }
      );
    }

    // Encrypt the password using bcrypt
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Generate token
    const rawToken = uuidv4();
    const token = base64url.encode(rawToken);

    // Create the new user
    const newUser = await db.user.create({
      data: {
        name,
        email,
        contactNumber,
        password: defaultPassword,
        hashedPassword,
        role,
        verificationToken: token,
      },
    });

    // Check if the user creation was successful
    if (!newUser) {
      return NextResponse.json(
        {
          data: null,
          message: "User creation failed. Profile will not be created.",
        },
        { status: 500 }
      );
    }

    // Create the ConsultantProfile if the role is CONSULTANT
    if (role === "CONSULTANT") {
      const consultantProfile = await db.consultantProfile.create({
        data: {
          gender,
          emergencyContactNumber,
          permanentAddress,
          currentAddress,
          joiningDate: validJoiningDate,
          isActive,
          role: {
            connect: { id: "67c45ea394b146da116aea1d" }, // by default making as basic consultant
          },
          // userId: newUser.id, // Link the ConsultantProfile to the newly created user
          user: {
            connect: { id: newUser.id }, // Ensure this user exists
          },
        },
      });
      // If the ConsultantProfile creation fails
      if (!consultantProfile) {
        // Optionally, you could rollback the user creation here if needed (manual delete)
        await db.user.delete({
          where: { id: newUser.id },
        });

        return NextResponse.json(
          {
            data: null,
            message:
              "Consultant profile creation failed. User creation rolled back.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          data: { newUser, consultantProfile },
          message: "Consultant and profile created successfully",
        },
        { status: 201 }
      );
    }

    // Return response for other roles
    return NextResponse.json(
      {
        data: newUser,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
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
    const consultants = await db.consultantProfile.findMany({
      include: {
        user: {
          select: { name: true, email: true, contactNumber: true }, // Select specific user fields
        },
        role: {
          select: {
            id: true,
            name: true, // Fetch only role ID and name
          },
        },
        assignedSectors: {
          include: {
            sector: { select: { id: true, sectorName: true } }, // Fetch sector details
          },
        },
        assignedDomains: {
          include: {
            domain: { select: { id: true, name: true } }, // Fetch domain details
          },
        },
      },
    });

    // Format the response
    const formattedConsultants = consultants.map((consultant) => ({
      id: consultant.id,
      name: consultant.user?.name || "N/A",
      email: consultant.user?.email || "N/A",
      contactNumber: consultant.user?.contactNumber || "N/A",
      currentAddress: consultant.currentAddress || "N/A",
      role: consultant.role
        ? { id: consultant.role.id, name: consultant.role.name }
        : null, // ✅ Include Role
      assignedSectors: consultant.assignedSectors.map((s) => ({
        id: s.sector.id,
        sectorName: s.sector.sectorName,
      })),
      assignedDomains: consultant.assignedDomains.map((d) => ({
        id: d.domain.id,
        name: d.domain.name,
      })),
    }));

    return new Response(JSON.stringify(formattedConsultants), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching Consultants:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch consultants", error }),
      { status: 500 }
    );
  }
}
