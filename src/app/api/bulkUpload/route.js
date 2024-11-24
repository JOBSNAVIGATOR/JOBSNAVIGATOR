import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Papa from "papaparse"; // Import PapaParse
import bcrypt from "bcrypt";
import { generateCandidateCode } from "@/lib/generateCandidateCode";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { Resend } from "resend";
import fs from "fs"; // To read file stream
import { generateRandomPassword } from "@/lib/generateRandomPassword";

const db = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file"); // Uploaded CSV file

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert the file buffer into a CSV string
    const buffer = await file.arrayBuffer();
    const csvData = Buffer.from(buffer).toString(); // Convert ArrayBuffer to string

    // Parse the CSV data using PapaParse
    const { data, errors } = Papa.parse(csvData, {
      header: true, // Use first row as headers
      skipEmptyLines: true, // Skip empty lines
    });

    if (errors.length) {
      return NextResponse.json(
        { message: "Error parsing the CSV file", errors },
        { status: 400 }
      );
    }

    const usersToCreate = [];
    const candidateProfilesToCreate = [];

    // Map email to user ID for linking profiles
    const emailToUserIdMap = new Map();

    data.forEach((row, index) => {
      const {
        name,
        email,
        contactNumber,
        emergencyContactNumber,
        gender,
        sector,
        domain,
        designation,
        currentCompany,
        previousCompanyName,
        currentJobLocation,
        totalWorkingExperience,
        currentCtc,
        degree,
        collegeName,
        graduationYear,
        skills,
        resume,
      } = row;

      if (!name || !email || !contactNumber) {
        throw new Error(`Missing required fields in row ${index + 1}`);
      }

      const defaultPassword = generateRandomPassword();
      const hashedPassword = bcrypt.hashSync(defaultPassword, 10); // Sync hashing for batch

      const rawToken = uuidv4();
      const token = base64url.encode(rawToken);

      // Generate a candidate code (assuming this function exists)
      const sequenceNumber = usersToCreate.length + 1;
      const candidateData = {
        name,
        currentCtc,
        sector,
        domain,
        currentJobLocation,
      };
      const candidateCode = generateCandidateCode(
        candidateData,
        sequenceNumber
      );

      // Add user creation data
      usersToCreate.push({
        name,
        email,
        contactNumber,
        password: defaultPassword,
        hashedPassword,
        role: "CANDIDATE",
        verificationToken: token,
      });

      const skillsArray = skills
        ? skills.split(",").map((skill) => skill.trim())
        : [];

      // Create candidate profile data
      candidateProfilesToCreate.push({
        gender,
        emergencyContactNumber,
        sector,
        domain,
        currentCtc,
        designation,
        currentCompany,
        currentJobLocation,
        totalWorkingExperience,
        degree,
        collegeName,
        graduationYear,
        previousCompanyName,
        resume,
        skills: skillsArray,
        candidateCode,
        email, // Temporarily store email for later mapping
      });
    });

    // Batch insert users into the database
    const createdUsers = await db.$transaction(
      usersToCreate.map((user) =>
        db.user.create({
          data: user,
        })
      )
    );

    // Map emails to the created user IDs
    createdUsers.forEach((user) => {
      emailToUserIdMap.set(user.email, user.id);
    });

    // Batch insert candidate profiles into the database
    const createdProfiles = await db.$transaction(
      candidateProfilesToCreate.map((profile) => {
        const userId = emailToUserIdMap.get(profile.email); // Get corresponding userId
        if (!userId) {
          throw new Error(`No user found for email: ${profile.email}`);
        }
        const { email, ...profileData } = profile; // Remove email before passing to Prisma
        return db.candidateProfile.create({
          data: {
            ...profileData,
            user: {
              connect: { id: userId }, // Link with the corresponding user
            },
          },
        });
      })
    );

    return NextResponse.json(
      {
        success: true, // Add this field
        message: "Bulk upload successful",
        createdUsers,
        createdProfiles,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in bulk upload:", error);
    return NextResponse.json(
      {
        message: "Server error during bulk upload",
        error,
      },
      { status: 500 }
    );
  }
}
