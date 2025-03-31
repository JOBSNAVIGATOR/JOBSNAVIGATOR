import db from "@/lib/db";
import { generateCandidateCode } from "@/lib/generateCandidateCode";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { generateRandomPassword } from "@/lib/generateRandomPassword";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import createTransporter from "@/lib/email";
import { userEmailTemplate } from "@/lib/userEmailTemplate";

export async function POST(request) {
  try {
    //extract the credentials
    const {
      name,
      email,
      contactNumber,
      emergencyContactNumber,
      gender,
      sector,
      sectorName,
      domain,
      domainName,
      state,
      state_name,
      district,
      district_name,
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

    const transporter = createTransporter();
    const linkText = "Verify Account";
    const userId = newUser.id;
    const redirectUrl = `login?token=${token}&id=${userId}`;
    const description = `Thank you for creating an account with us. We request you to click
                on the link below to ${linkText}. Thank you! Your default password for login is: ${defaultPassword}`;
    const emailHtml = userEmailTemplate(
      name,
      description,
      linkText,
      redirectUrl
    );

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: email, // Recipient address
      subject: "Account Verification from JOBSNAVIGATOR",
      html: emailHtml,
    };
    try {
      await transporter.sendMail(mailOptions);
      // console.log("Email sent successfully to:", email);
    } catch (mailError) {
      console.error("Failed to send email:", mailError);
    }

    const sequenceNumber = (await db.candidateProfile.count()) + 1;
    const candidateData = {
      id: newUser.id, // Use the new user's ID
      name: newUser.name,
      currentCtc,
      sectorName,
      domainName,
      district_name,
    };

    const candidateCode = generateCandidateCode(candidateData, sequenceNumber);

    const newCandidateProfile = await db.candidateProfile.create({
      data: {
        gender,
        emergencyContactNumber,
        // sector,
        // domain,
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
        user: {
          connect: { id: newUser.id }, // Linking candidate profile to the existing user
        },
      },
    });
    // console.log(newCandidateProfile);
    // Create an entry in CandidateJourney (History)
    const newCandidateJourney = await db.candidateJourney.create({
      data: {
        candidateId: newCandidateProfile.id, // Linking the journey to the new candidate profile
        eventType: "PROFILE_CREATED", // Event type: Profile Created
        remarks: `Candidate ${name} profile created.`,
        createdAt: new Date(), // Current timestamp
      },
    });

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
    // Get the logged-in user's session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ message: "Unauthorized access" }), {
        status: 401,
      });
    }
    // If user is an ADMIN, fetch all candidates
    console.log("consultantRole", session?.user?.profileType);
    const consultantRole = session?.user?.profileType;
    if (
      session.user.role === "ADMIN" ||
      consultantRole === "Admin Consultant"
    ) {
      const allCandidates = await db.candidateProfile.findMany({
        include: {
          user: true,
          sector: true,
          domain: true,
          state: true,
          district: true,
        },
      });

      return new Response(JSON.stringify(formatCandidates(allCandidates)), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find the consultant profile of the logged-in user
    const consultant = await db.consultantProfile.findUnique({
      where: { userId: session.user.id },
      include: { assignedDomains: true, assignedDistricts: true },
    });

    if (!consultant) {
      return new Response(
        JSON.stringify({ message: "Consultant profile not found" }),
        { status: 404 }
      );
    }
    // Get the domain IDs assigned to the consultant
    const assignedDomainIds = consultant.assignedDomains.map(
      (assignedDomain) => assignedDomain.domainId
    );
    // Get the district IDs assigned to the consultant
    const assignedDistrictIds = consultant.assignedDistricts.map(
      (assignedDistrict) => assignedDistrict.districtId
    );

    console.log("backedbdbjbx", assignedDistrictIds);

    if (assignedDomainIds.length === 0) {
      return new Response(
        JSON.stringify({ message: "No assigned domains found" }),
        { status: 200 }
      );
    }
    if (assignedDistrictIds.length === 0) {
      return new Response(
        JSON.stringify({ message: "No assigned districts found" }),
        { status: 200 }
      );
    }

    // Convert assignedLevel to a number
    const assignedLevel = Number(consultant.assignedLevel);

    // Calculate max CTC allowed
    const maxCtcAllowed = assignedLevel * 5;
    // Fetch candidates whose domainId matches any of the consultant's assigned domains
    const candidates = await db.candidateProfile.findMany({
      where: {
        domainId: { in: assignedDomainIds },
        districtId: { in: assignedDistrictIds },
        currentCtc: {
          lte: maxCtcAllowed.toString(), // Convert back to string for Prisma query
        },
      },
      include: {
        user: true,
        sector: true,
        domain: true,
        state: true,
        district: true,
      },
    });
    // Map the data to include only the necessary fields
    // const formattedCandidates = candidates.map((candidate) => ({
    //   id: candidate.id,
    //   candidateCode: candidate.candidateCode,
    //   name: candidate.user.name, // Assuming user has a name field
    //   email: candidate.user.email, // Assuming user has an email field
    //   gender: candidate.gender,
    //   contactNumber: candidate.user.contactNumber,
    //   emergencyContactNumber: candidate.emergencyContactNumber,
    //   sector: candidate.sector.sectorName,
    //   domain: candidate.domain.name,
    //   currentCtc: candidate.currentCtc,
    //   designation: candidate.designation,
    //   currentCompany: candidate.currentCompany,
    //   currentJobLocation: candidate.currentJobLocation,
    //   totalWorkingExperience: candidate.totalWorkingExperience,
    //   degree: candidate.degree,
    //   collegeName: candidate.collegeName,
    //   graduationYear: candidate.graduationYear,
    //   previousCompanyName: candidate.previousCompanyName,
    //   skills: candidate.skills,
    //   resume: candidate.resume,
    //   mailSent: candidate.mailSent,
    //   mailSentDate: candidate.mailSentDate,
    //   mailSubject: candidate.mailSubject,
    //   mailTemplateName: candidate.mailTemplateName,
    //   mailSender: candidate.mailSender,
    //   // Include any other fields you need
    // }));

    return new Response(JSON.stringify(formatCandidates(candidates)), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch candidates", error }),
      { status: 500 }
    );
  }
}

// Helper function to format candidate data
function formatCandidates(candidates) {
  return candidates.map((candidate) => ({
    id: candidate.id,
    candidateCode: candidate.candidateCode,
    name: candidate.user.name,
    email: candidate.user.email,
    gender: candidate.gender,
    contactNumber: candidate.user.contactNumber,
    emergencyContactNumber: candidate.emergencyContactNumber,
    sector: candidate.sector.sectorName,
    domain: candidate.domain.name,
    state: candidate.state.state_name,
    district: candidate.district.district_name,
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
  }));
}
