import db from "@/lib/db";
import { generateCandidateCode } from "@/lib/generateCandidateCode";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { Resend } from "resend";
import { EmailTemplateTwo } from "@/components/email-template-two";
import { generateRandomPassword } from "@/lib/generateRandomPassword";

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    //extract the credentials
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
      resume, // URL or file path to the resume
    } = await request.json();
    //Check if the user Already exists in the db
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: `User with this email ( ${email})  already exists in the Database`,
        },
        { status: 409 }
      );
    }

    // Encrypt the Password =>bcrypt
    const defaultPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // generate token
    // genrate a random UUID (version 4)
    const rawToken = uuidv4();
    // Encode the token using Base64 URL- safe format
    const token = base64url.encode(rawToken);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        contactNumber,
        password: defaultPassword,
        hashedPassword,
        role: "CANDIDATE",
        verificationToken: token,
      },
    });

    // Send an email with the token on the link as a search param
    const userId = newUser.id;
    const linkText = "Verify Account";
    const redirectUrl = `login?token=${token}&id=${userId}`;
    const sendMail = await resend.emails.send({
      from: "LifeEasyWay <info@lifeeasyway.com>",
      to: email,
      subject: "Account Verification from Auth System",
      react: EmailTemplateTwo({ name, redirectUrl, linkText, defaultPassword }),
    });

    const sequenceNumber = (await db.candidateProfile.count()) + 1;
    const candidateData = {
      id: newUser.id, // Use the new user's ID
      name: newUser.name,
      currentCtc,
      sector,
      domain,
      currentJobLocation,
    };

    const candidateCode = generateCandidateCode(candidateData, sequenceNumber);

    const newCandidateProfile = await db.candidateProfile.create({
      data: {
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
        resume, // URL or file path to the resume
        skills,
        candidateCode, // Storing the generated candidate code
        user: {
          connect: { id: newUser.id }, // Linking candidate profile to the existing user
        },
      },
    });
    // console.log(newCandidateProfile);

    return NextResponse.json(
      {
        data: newCandidateProfile,
        message: "Profile Created Successfully",
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
    // Fetch all candidates from the candidate profile
    const candidates = await db.candidateProfile.findMany({
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
      gender: candidate.gender,
      contactNumber: candidate.user.contactNumber,
      emergencyContactNumber: candidate.emergencyContactNumber,
      sector: candidate.sector,
      domain: candidate.domain,
      currentCtc: candidate.currentCtc,
      designation: candidate.designation,
      currentCompany: candidate.currentCompany,
      currentJobLocation: candidate.currentJobLocation,
      totalWorkingExperience: candidate.totalWorkingExperience,
      degree: candidate.degree,
      collegeName: candidate.collegeName,
      graduationYear: candidate.graduationYear,
      previousCompanyName: candidate.previousCompanyName,
      skills: candidate.skills,
      resume: candidate.resume,
      mailSent: candidate.mailSent,
      mailSentDate: candidate.mailSentDate,
      mailSubject: candidate.mailSubject,
      mailTemplateName: candidate.mailTemplateName,
      mailSender: candidate.mailSender,
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
