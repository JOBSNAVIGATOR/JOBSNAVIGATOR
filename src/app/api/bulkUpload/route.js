import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import base64url from "base64url";
import Papa from "papaparse";
import db from "@/lib/db";
import { bulkGenerateCandidateCode } from "@/lib/bulkGenerateCandidateCode";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const sector = formData.get("sector");
    const sectorName = formData.get("sectorName");
    const domain = formData.get("domain");
    const domainName = formData.get("domainName");
    const state = formData.get("state");
    const state_name = formData.get("state_name");
    const district = formData.get("district");
    const district_name = formData.get("district_name");
    const consultantName = formData.get("consultantName");

    // Validate file input
    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }
    if (!sector || !domain || !state || !district) {
      return NextResponse.json(
        { message: "Missing required relationship IDs" },
        { status: 400 }
      );
    }

    // Add this validation function
    function isValidObjectId(id) {
      return /^[0-9a-fA-F]{24}$/.test(id);
    }
    if (![sector, domain, state, district].every(isValidObjectId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Convert the file buffer into a CSV string
    const buffer = await file.arrayBuffer();
    const csvData = Buffer.from(buffer).toString();

    // Parse the CSV data using PapaParse
    const { data, errors } = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    // Handle CSV parsing errors
    if (errors.length) {
      return NextResponse.json(
        { message: "Error parsing CSV file", details: errors },
        { status: 400 }
      );
    }

    // Step 1: Collect all emails from the CSV data
    const allEmails = data.map((row) => row.email);

    // Step 2: Query the database for existing emails
    const existingUsers = await db.user.findMany({
      where: {
        email: {
          in: allEmails,
        },
      },
      select: {
        email: true,
      },
    });

    // Create a Set of existing emails for quick lookup
    const existingEmailsSet = new Set(existingUsers.map((user) => user.email));

    // Initialize an array to store duplicate emails
    const duplicateEmails = [];

    // Get initial sequence number for candidate codes
    const initialSequenceNumber = await db.candidateProfile.count();
    const startSequenceNumber = initialSequenceNumber + 1;
    const failedRows = [];

    const validData = data.filter((row, index) => {
      if (existingEmailsSet.has(row.email)) {
        // Step 4: Log or store the duplicate email
        duplicateEmails.push({ row: index + 1, email: row.email });
        return false; // Skip this entry
      }
      try {
        validateRow(row); // Custom function to validate individual rows
        row.candidateCode = bulkGenerateCandidateCode(
          row,
          sectorName,
          domainName,
          state_name,
          district_name,
          startSequenceNumber + index
        );
        return true;
      } catch (err) {
        console.log(err);
        failedRows.push({ row: index + 1, error: err.message });
        return false;
      }
    });

    // Filter out any rows that were invalid (null) and then proceed with bulk user creation
    const results = await db.$transaction(
      validData.map((row) => {
        const password = generateRandomPassword(); // Generate unique password
        const hashedPassword = bcrypt.hashSync(password, 10); // Hash the unique password
        return db.user.create({
          data: {
            name: row.name,
            email: row.email,
            contactNumber: row.contactNumber,
            password, // Store the plaintext password (if needed to send to the user)
            hashedPassword, // Store the hashed password for authentication
            role: "CANDIDATE",
            verificationToken: base64url.encode(uuidv4()),
            candidateProfile: {
              create: {
                gender: row.gender || null,
                emergencyContactNumber: row.emergencyContactNumber || null,
                sector: {
                  connect: { id: sector },
                },
                domain: {
                  connect: { id: domain },
                },
                state: {
                  connect: { id: state },
                },
                district: {
                  connect: { id: district },
                },
                currentCtc: row.currentCtc || null,
                designation: row.designation || null,
                currentCompany: row.currentCompany || null,
                // currentJobLocation: row.currentJobLocation || null,
                totalWorkingExperience: row.totalWorkingExperience || null,
                degree: row.degree || null,
                collegeName: row.collegeName || null,
                graduationYear: row.graduationYear || null,
                previousCompanyName: row.previousCompanyName || null,
                resume: row.resume || null,
                skills: row.skills
                  ? row.skills.split(",").map((skill) => skill.trim())
                  : [],
                candidateCode: row.candidateCode,
                bulkUpload: true,
                journeys: {
                  create: {
                    eventType: "PROFILE_CREATED", // Event type: Profile Created
                    remarks: `Candidate ${row.name} profile created using Bulk Upload by consultant - ${consultantName}.`,
                    createdAt: new Date(), // Current timestamp
                  },
                },
              },
            },
          },
        });
      })
    );

    // Return a response, including any failed rows
    // if (failedRows.length) {
    //   return NextResponse.json(
    //     {
    //       message: "Bulk upload partially successful",
    //       failedRows,
    //     },
    //     { status: 207 } // Multi-Status for partial success
    //   );
    // }

    return NextResponse.json(
      {
        success: true,
        message: "Bulk upload completed with some duplicates",
        createdUsers: results,
        duplicateEmails,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in bulk upload:", error);
    return NextResponse.json(
      { message: `Server error during bulk upload: ${error.message}` },
      { status: 500 }
    );
  }
}

// Utility function to generate a random password
function generateRandomPassword() {
  return Math.random().toString(36).slice(-8);
}

// Utility function to validate rows (example)
function validateRow(row) {
  if (!row.name || !row.email || !row.contactNumber) {
    throw new Error("Missing required fields: name, email, or contactNumber");
  }
}

export async function GET(req) {
  try {
    // Fetch all candidates from the candidate profile
    const candidates = await db.candidateProfile.findMany({
      where: {
        bulkUpload: true,
      },
      include: {
        user: true, // Assuming you have a relation to the user model
      },
    });

    // Map the data to include only the necessary fields
    const formattedCandidates = candidates.map((candidate) => ({
      id: candidate.id,
      candidateCode: candidate.candidateCode,
      name: candidate.user.name, // Assuming user has a name field
      email: candidate.user.email, // Assuming user has an email field
      contactNumber: candidate.contactNumber,
      currentCtc: candidate.currentCtc,
      currentJobLocation: candidate.currentJobLocation,
      currentCompany: candidate.currentCompany,
      resume: candidate.resume,
      // Include any other fields you need
    }));

    return new Response(JSON.stringify(formattedCandidates), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // console.error("Error fetching candidates:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch candidates", error }),
      { status: 500 }
    );
  }
}
