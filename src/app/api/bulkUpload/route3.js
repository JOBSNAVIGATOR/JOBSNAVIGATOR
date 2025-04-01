import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import base64url from "base64url";
import Papa from "papaparse";
import db from "@/lib/db";
import { bulkGenerateCandidateCode } from "@/lib/bulkGenerateCandidateCode";

export async function POST(request) {
  try {
    // Parse the incoming form data
    // const { sector, domain, state, district, file } = await request.json();
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

    // Validate file input
    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
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

    // Get initial sequence number for candidate codes
    const initialSequenceNumber = await db.candidateProfile.count();
    const failedRows = [];

    // Validate and process each row
    const validData = data.filter(async (row, index) => {
      try {
        validateRow(row); // Custom function to validate individual rows
        // console.log(row);
        return true;
      } catch (error) {
        // console.error("Error in bulk upload:", error);
        failedRows.push({ row: index + 1, error: error.message });
        return false;
      }
    });

    // Filter out any rows that were invalid (null) and then proceed with bulk user creation
    const results = await db.$transaction(
      validData.map(async (row, index) => {
        const password = generateRandomPassword(); // Generate unique password
        const hashedPassword = bcrypt.hashSync(password, 10); // Hash the unique password
        const candidateCode = bulkGenerateCandidateCode(
          row,
          sectorName,
          domainName,
          state_name,
          district_name,
          initialSequenceNumber + index
        );
        return db.user
          .create({
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
                  // sector: row.sector || null,
                  // domain: row.domain || null,
                  sector: {
                    connect: { id: sector }, // Linking candidate profile to the existing user
                  },
                  domain: {
                    connect: { id: domain }, // Linking candidate profile to the existing user
                  },
                  state: {
                    connect: { id: state }, // Linking candidate profile to the existing user
                  },
                  district: {
                    connect: { id: district }, // Linking candidate profile to the existing user
                  },
                  currentCtc: row.currentCtc || null,
                  designation: row.designation || null,
                  currentCompany: row.currentCompany || null,
                  currentJobLocation: row.currentJobLocation || null,
                  totalWorkingExperience: row.totalWorkingExperience || null,
                  degree: row.degree || null,
                  collegeName: row.collegeName || null,
                  graduationYear: row.graduationYear || null,
                  previousCompanyName: row.previousCompanyName || null,
                  resume: row.resume || null,
                  skills: row.skills
                    ? row.skills.split(",").map((skill) => skill.trim())
                    : [],
                  candidateCode: candidateCode,
                  bulkUpload: true,
                },
              },
            },
          })
          .then(async (user) => {
            // Explicitly fetch the candidate profile after user creation
            const candidateProfile = await db.candidateProfile.findUnique({
              where: { userId: user.id }, // Make sure to fetch by the correct relation
            });

            // Now that we have the candidate profile, create the candidate journey
            if (candidateProfile) {
              await createCandidateJourney(candidateProfile.id, user.name);
            }
            return user;
          });
      })
    );

    // Return a response, including any failed rows
    if (failedRows.length) {
      return NextResponse.json(
        {
          message: "Bulk upload partially successful",
          failedRows,
        },
        { status: 207 } // Multi-Status for partial success
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Bulk upload successful",
        createdUsers: results,
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
// Function to create candidate journey
async function createCandidateJourney(candidateProfileId, name) {
  await db.candidateJourney.create({
    data: {
      candidateId: candidateProfileId,
      eventType: "PROFILE_CREATED", // Event type: Profile Created
      remarks: `Candidate ${name} profile created.`,
      createdAt: new Date(), // Current timestamp
    },
  });
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
