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
//       header: true, // Use first row as headers
//       skipEmptyLines: true, // Skip empty lines
//     });

//     // if (errors.length) {
//     //   return NextResponse.json(
//     //     { message: "Error parsing the CSV file", errors },
//     //     { status: 400 }
//     //   );
//     // }
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

//     const usersToCreate = [];
//     const candidateProfilesToCreate = [];
//     const failedRows = [];

//     // Map email to user ID for linking profiles
//     const emailToUserIdMap = new Map();

//     data.forEach((row, index) => {
//       try {
//         const {
//           name,
//           email,
//           contactNumber,
//           emergencyContactNumber,
//           gender,
//           sector,
//           domain,
//           designation,
//           currentCompany,
//           previousCompanyName,
//           currentJobLocation,
//           totalWorkingExperience,
//           currentCtc,
//           degree,
//           collegeName,
//           graduationYear,
//           skills,
//           resume,
//         } = row;

//         if (!name || !email || !contactNumber) {
//           throw new Error(`Missing required fields in row ${index + 1}`);
//         }

//         const defaultPassword = generateRandomPassword();
//         const hashedPassword = bcrypt.hashSync(defaultPassword, 10); // Sync hashing for batch

//         const rawToken = uuidv4();
//         const token = base64url.encode(rawToken);

//         // Generate a candidate code (assuming this function exists)
//         const sequenceNumber = initialSequenceNumber + index;
//         const candidateData = {
//           name,
//           currentCtc,
//           sector,
//           domain,
//           currentJobLocation,
//         };
//         const candidateCode = generateCandidateCode(
//           candidateData,
//           sequenceNumber
//         );

//         // Add user creation data
//         usersToCreate.push({
//           name,
//           email,
//           contactNumber,
//           password: defaultPassword,
//           hashedPassword,
//           role: "CANDIDATE",
//           verificationToken: token,
//         });

//         const skillsArray = skills
//           ? skills.split(",").map((skill) => skill.trim())
//           : [];

//         // Create candidate profile data
//         candidateProfilesToCreate.push({
//           gender: gender || null,
//           emergencyContactNumber: emergencyContactNumber || null,
//           sector,
//           domain,
//           currentCtc,
//           designation: designation || null,
//           currentCompany: currentCompany || null,
//           currentJobLocation: currentJobLocation || null,
//           totalWorkingExperience: totalWorkingExperience || null,
//           degree: degree || null,
//           collegeName: collegeName || null,
//           graduationYear: graduationYear || null,
//           previousCompanyName: previousCompanyName || null,
//           resume: resume || null,
//           skills: skillsArray,
//           candidateCode: candidateCode || null,
//           bulkUpload: true,
//           email, // Temporarily store email for later mapping
//         });
//       } catch (err) {
//         failedRows.push({
//           row: index + 1,
//           error: err.message,
//         });
//       }
//     });

//     if (failedRows.length > 0) {
//       return NextResponse.json(
//         {
//           message: "Some rows failed during validation",
//           failedRows,
//         },
//         { status: 400 }
//       );
//     }

//     // Batch insert users into the database
//     const createdUsers = await db.$transaction(
//       usersToCreate.map((user) =>
//         db.user.create({
//           data: user,
//         })
//       )
//     );

//     // Map emails to the created user IDs
//     createdUsers.forEach((user) => {
//       emailToUserIdMap.set(user.email, user.id);
//     });

//     // Batch insert candidate profiles into the database
//     const createdProfiles = await db.$transaction(
//       candidateProfilesToCreate.map((profile) => {
//         const userId = emailToUserIdMap.get(profile.email); // Get corresponding userId
//         if (!userId) {
//           throw new Error(`No user found for email: ${profile.email}`);
//         }
//         const { email, ...profileData } = profile; // Remove email before passing to Prisma
//         return db.candidateProfile.create({
//           data: {
//             ...profileData,
//             user: {
//               connect: { id: userId }, // Link with the corresponding user
//             },
//           },
//         });
//       })
//     );

//     return NextResponse.json(
//       {
//         success: true, // Add this field
//         message: "Bulk upload successful",
//         createdUsers,
//         createdProfiles,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error in bulk upload:", error);
//     return NextResponse.json(
//       {
//         message: `Server error during bulk upload ${error.message}`,
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file"); // Uploaded CSV file
    const initialSequenceNumber = (await db.candidateProfile.count()) + 1;

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
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length) {
      return NextResponse.json(
        {
          message: "Error parsing the CSV file",
          details: errors.map((err) => ({
            row: err.row,
            error: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const failedRows = [];
    const sequenceNumberOffset = initialSequenceNumber;

    // Start a single transaction
    const results = await db.$transaction(
      data.map((row, index) => {
        try {
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
          const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

          const rawToken = uuidv4();
          const token = base64url.encode(rawToken);

          const candidateData = {
            name,
            currentCtc,
            sector,
            domain,
            currentJobLocation,
          };
          const candidateCode = generateCandidateCode(
            candidateData,
            sequenceNumberOffset + index
          );

          const skillsArray = skills
            ? skills.split(",").map((skill) => skill.trim())
            : [];

          return db.user.create({
            data: {
              name,
              email,
              contactNumber,
              password: defaultPassword,
              hashedPassword,
              role: "CANDIDATE",
              verificationToken: token,
              candidateProfile: {
                create: {
                  gender: gender || null,
                  emergencyContactNumber: emergencyContactNumber || null,
                  sector: sector || null,
                  domain: domain || null,
                  currentCtc: currentCtc || null,
                  designation: designation || null,
                  currentCompany: currentCompany || null,
                  currentJobLocation: currentJobLocation || null,
                  totalWorkingExperience: totalWorkingExperience || null,
                  degree: degree || null,
                  collegeName: collegeName || null,
                  graduationYear: graduationYear || null,
                  previousCompanyName: previousCompanyName || null,
                  resume: resume || null,
                  skills: skillsArray,
                  candidateCode: candidateCode || null,
                  bulkUpload: true,
                },
              },
            },
          });
        } catch (err) {
          const errorField = extractErrorField(err);
          failedRows.push({
            row: index + 1,
            error: err.message,
          });
        }
      })
    );

    if (failedRows.length > 0) {
      return NextResponse.json(
        {
          message: "Some rows failed during validation",
          failedRows,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Bulk upload successful",
        createdUsers: results, // Include created users and profiles
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in bulk upload:", error);
    return NextResponse.json(
      {
        message: `Server error during bulk upload: ${error.message}`,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

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

//     const results = await Promise.allSettled(
//       data.map(async (row, index) => {
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

//           return await db.user.create({
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
//                   sector,
//                   domain,
//                   currentCtc,
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
//             field: errorField,
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
//         createdUsers: results.filter((result) => result.status === "fulfilled"),
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error in bulk upload:", error);
//     return NextResponse.json(
//       {
//         message: `Server error during bulk upload: ${error.message}`,
//       },
//       { status: 500 }
//     );
//   }
// }

// function extractErrorField(err) {
//   if (err.meta && err.meta.target) {
//     return err.meta.target; // Prisma error provides a `meta.target` field indicating the invalid field
//   }
//   return "Unknown Field";
// }

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
