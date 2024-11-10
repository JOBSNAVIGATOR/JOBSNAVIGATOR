import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Papa from "papaparse"; // Import PapaParse
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
    console.log(formData);

    const file = formData.get("file"); // The CSV file
    console.log(file);

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
    const chunks = [];

    console.log("fileStream", fileStream);

    // // Collect the file data in chunks
    // fileStream.on("data", (chunk) => {
    //   chunks.push(chunk);
    // });

    // console.log("chunks", chunks);

    // // Wait for the file stream to finish
    // await new Promise((resolve, reject) => {
    //   fileStream.on("end", resolve);
    //   fileStream.on("error", reject);
    // });

    // Convert the file to a buffer using the file stream
    const buffer = await file.arrayBuffer();

    // Convert the file chunks to a string
    // const csvData = Buffer.concat(chunks).toString();
    const csvData = Buffer.from(buffer).toString(); // Convert ArrayBuffer to string

    // Parse the CSV data with PapaParse
    const { data, errors } = Papa.parse(csvData, {
      header: true, // Treat the first row as headers
      skipEmptyLines: true, // Skip empty lines
    });

    if (errors.length) {
      console.error("CSV parsing errors:", errors);
      return NextResponse.json(
        { message: "Error parsing the CSV file", errors },
        { status: 400 }
      );
    }

    // Process each row of CSV data
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
