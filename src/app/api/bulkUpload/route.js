import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import csv from "fast-csv"; // Or use 'csv-parser' instead if preferred
import bcrypt from "bcrypt";
import { generateCandidateCode } from "@/lib/generateCandidateCode";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { Resend } from "resend";
import fs from "fs"; // To read file stream

const db = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    // Get the uploaded CSV file from the request
    const formData = await request.formData();
    const file = formData.get("file"); // The CSV file

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const usersToCreate = [];
    const candidateProfilesToCreate = [];

    // Create a file stream from the CSV file
    const fileStream = file.stream();

    // Parse the CSV file
    await new Promise((resolve, reject) => {
      fileStream
        .pipe(csv.parse({ headers: true })) // Parsing with headers enabled
        .on("data", (row) => {
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
            resume, // Assuming the resume is in URL format
          } = row;

          const defaultPassword = generateRandomPassword();
          const hashedPassword = bcrypt.hashSync(defaultPassword, 10); // Sync method for bulk processing

          // Generate a verification token
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

          // Create user and candidate profile data
          usersToCreate.push({
            name,
            email,
            contactNumber,
            password: defaultPassword,
            hashedPassword,
            role: "CANDIDATE",
            verificationToken: token,
          });

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
            skills,
            candidateCode,
            userEmail: email, // Temporary field for linking users later
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // Insert the users and candidate profiles into the database
    const createdUsers = await db.$transaction(
      usersToCreate.map((user) =>
        db.user.create({
          data: user,
        })
      )
    );

    // Link candidate profiles to the created users
    const userByEmail = createdUsers.reduce(
      (map, user) => ((map[user.email] = user.id), map),
      {}
    );

    const createdProfiles = await db.$transaction(
      candidateProfilesToCreate.map((profile) =>
        db.candidateProfile.create({
          data: {
            ...profile,
            user: {
              connect: { id: userByEmail[profile.userEmail] },
            },
          },
        })
      )
    );

    return NextResponse.json(
      {
        message: "Bulk upload successful",
        createdUsers,
        createdProfiles,
      },
      { status: 201 }
    );
  } catch (error) {
    // console.error("Error in bulk upload:", error);
    return NextResponse.json(
      {
        message: "Server error during bulk upload",
        error,
      },
      { status: 500 }
    );
  }
}
