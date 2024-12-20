// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file"); // Uploaded CSV file
//     const initialSequenceNumber = (await db.candidateProfile.count()) + 1;

//     if (!file) {
//       return NextResponse.json(
//         { message: "No file uploaded" },
//         { status: 400 }
//       );
//     }

//     // Convert the file buffer into a CSV string
//     const buffer = await file.arrayBuffer();
//     const csvData = Buffer.from(buffer).toString(); // Convert ArrayBuffer to string

//     // Parse the CSV data using PapaParse
//     const { data, errors } = Papa.parse(csvData, {
//       header: true,
//       skipEmptyLines: true,
//     });

//     if (errors.length) {
//       return NextResponse.json(
//         {
//           message: "Error parsing the CSV file",
//           details: errors.map((err) => ({
//             row: err.row,
//             error: err.message,
//           })),
//         },
//         { status: 400 }
//       );
//     }

//     const failedRows = [];
//     const sequenceNumberOffset = initialSequenceNumber;

//     // Start a single transaction
//     const results = await db.$transaction(
//       data.map((row, index) => {
//         try {
//           const {
//             name,
//             email,
//             contactNumber,
//             emergencyContactNumber,
//             gender,
//             sector,
//             domain,
//             designation,
//             currentCompany,
//             previousCompanyName,
//             currentJobLocation,
//             totalWorkingExperience,
//             currentCtc,
//             degree,
//             collegeName,
//             graduationYear,
//             skills,
//             resume,
//           } = row;

//           if (!name || !email || !contactNumber) {
//             throw new Error(`Missing required fields in row ${index + 1}`);
//           }

//           const defaultPassword = generateRandomPassword();
//           const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

//           const rawToken = uuidv4();
//           const token = base64url.encode(rawToken);

//           const candidateData = {
//             name,
//             currentCtc,
//             sector,
//             domain,
//             currentJobLocation,
//           };
//           const candidateCode = generateCandidateCode(
//             candidateData,
//             sequenceNumberOffset + index
//           );

//           const skillsArray = skills
//             ? skills.split(",").map((skill) => skill.trim())
//             : [];

//           return db.user.create({
//             data: {
//               name,
//               email,
//               contactNumber,
//               password: defaultPassword,
//               hashedPassword,
//               role: "CANDIDATE",
//               verificationToken: token,
//               candidateProfile: {
//                 create: {
//                   gender: gender || null,
//                   emergencyContactNumber: emergencyContactNumber || null,
//                   sector: sector || null,
//                   domain: domain || null,
//                   currentCtc: currentCtc || null,
//                   designation: designation || null,
//                   currentCompany: currentCompany || null,
//                   currentJobLocation: currentJobLocation || null,
//                   totalWorkingExperience: totalWorkingExperience || null,
//                   degree: degree || null,
//                   collegeName: collegeName || null,
//                   graduationYear: graduationYear || null,
//                   previousCompanyName: previousCompanyName || null,
//                   resume: resume || null,
//                   skills: skillsArray,
//                   candidateCode: candidateCode || null,
//                   bulkUpload: true,
//                 },
//               },
//             },
//           });
//         } catch (err) {
//           const errorField = extractErrorField(err);
//           failedRows.push({
//             row: index + 1,
//             error: err.message,
//           });
//         }
//       })
//     );

//     if (failedRows.length > 0) {
//       return NextResponse.json(
//         {
//           message: "Some rows failed during validation",
//           failedRows,
//         },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Bulk upload successful",
//         createdUsers: results, // Include created users and profiles
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error in bulk upload:", error);
//     return NextResponse.json(
//       {
//         message: `Server error during bulk upload: ${error.message}`,
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import base64url from "base64url";
import Papa from "papaparse";

import db from "@/lib/db";
import { generateCandidateCode } from "@/lib/generateCandidateCode";

export async function POST(request) {
  try {
    // Parse the incoming form data
    const formData = await request.formData();
    const file = formData.get("file");

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
    const validData = data.filter((row, index) => {
      try {
        validateRow(row); // Custom function to validate individual rows
        row.candidateCode = generateCandidateCode(
          row,
          initialSequenceNumber + index
        );
        return true;
      } catch (err) {
        failedRows.push({ row: index + 1, error: err.message });
        return false;
      }
    });

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
                sector: row.sector || null,
                domain: row.domain || null,
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
                candidateCode: row.candidateCode,
                bulkUpload: true,
              },
            },
          },
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
