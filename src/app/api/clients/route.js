import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { generateRandomPassword } from "@/lib/generateRandomPassword";
import { generateClientCode } from "@/lib/generateClientCode";

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
      designation,
      currentCompany,
      currentCtc,
      functionalArea,
      dateOfJoining,
      currentJobLocation,
    } = await request.json();
    //Check if the user Already exists in the db
    // console.log("heck1");

    const modifiedDateOfJoining = new Date(dateOfJoining);

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
        role: "CLIENT",
        verificationToken: token,
      },
    });

    const sequenceNumber = (await db.clientProfile.count()) + 1;
    // console.log("chck2", sequenceNumber);

    const companyData = await db.company.findUnique({
      where: {
        id: currentCompany,
      },
    });

    // console.log("check3", companyData);

    const clientData = {
      id: newUser.id, // Use the new user's ID
      dateOfJoining,
      functionalArea,
      sectorName,
      domainName,
      currentCtc,
      currentJobLocation,
      currentCompanyName: companyData.companyName,
      designation,
    };

    // console.log("cehck5", clientData);

    const clientCode = generateClientCode(clientData, sequenceNumber);
    // console.log(clientCode);

    const newClientProfile = await db.clientProfile.create({
      data: {
        gender,
        emergencyContactNumber,
        currentCtc,
        designation,
        currentJobLocation,
        clientCode, // Storing the generated client code
        dateOfJoining: modifiedDateOfJoining,
        functionalArea,
        company: {
          connect: { id: currentCompany }, // Use connect to link with the Company
        },
        sector: {
          connect: { id: sector }, // Use connect to link with the Company
        },
        domain: {
          connect: { id: domain }, // Use connect to link with the Company
        },
        user: {
          connect: { id: newUser.id }, // Linking candidate profile to the existing user
        },
      },
    });
    // console.log(newClientProfile);

    return NextResponse.json(
      {
        data: newClientProfile,
        message: "Profile Created Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
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
    const clients = await db.clientProfile.findMany({
      include: {
        user: true, // Assuming you have a relation to the user model
        company: true,
      },
    });

    // Map the data to include only the necessary fields
    const formattedClients = clients.map((client) => ({
      id: client.id,
      clientCode: client.clientCode,
      name: client.user.name, // Assuming user has a name field
      email: client.user.email, // Assuming user has an email field
      contactNumber: client.user.contactNumber,
      currentCtc: client.currentCtc,
      sector: client.sector,
      domain: client.domain,
      designation: client.designation,
      functionalArea: client.functionalArea,
      currentJobLocation: client.currentJobLocation,
      currentCompany: client.company.companyName,
      // Include any other fields you need
    }));

    return new Response(JSON.stringify(formattedClients), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // console.error("Error fetching clients:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch clients", error }),
      { status: 500 }
    );
  }
}
