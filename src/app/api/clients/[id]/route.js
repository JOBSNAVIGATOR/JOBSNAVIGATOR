import db from "@/lib/db";
import { generateNewClientCode } from "@/lib/generateNewClientCode";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const {
      id,
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
      clientCode,
    } = await request.json();

    const modifiedDateOfJoining = new Date(dateOfJoining);

    const clientProfile = await db.clientProfile.findUnique({
      where: {
        id,
      },
    });
    if (!clientProfile) {
      return NextResponse.json(
        {
          data: null,
          message: "No Client Profile Found, Please Create One",
        },
        { status: 404 }
      );
    }

    const companyData = await db.company.findUnique({
      where: {
        id: currentCompany,
      },
    });

    // Skip the sector, as we will replace it // Skip the domain initials, as we will replace it // Skip the level, as we will replace it // Skip the location initials, as we will replace it
    const [
      existingPrefix,
      existingPrefixTwo,
      existingSequence,
      existingSuffix,
    ] = clientCode.split(" ");
    // console.log(prefix, existingDate, existingInitials, sequence);

    const clientData = {
      dateOfJoining,
      functionalArea,
      sectorName,
      domainName,
      currentCtc,
      currentJobLocation,
      gender,
      currentCompanyName: companyData.companyName,
      designation,
    };
    const updatedCodePart = generateNewClientCode(clientData);

    // Rebuild the candidateCode using existing parts + updated sector, domain, level, location
    const updatedClientCode = `${existingPrefix} ${existingPrefixTwo} ${existingSequence} ${updatedCodePart}`;
    // console.log("clientCodeupdated", updatedClientCode);

    const updatedClientProfile = await db.clientProfile.update({
      where: {
        id,
      },
      data: {
        gender,
        emergencyContactNumber,
        currentCtc,
        designation,
        currentJobLocation,
        clientCode: updatedClientCode, // Storing the generated client code
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
      },
    });

    return NextResponse.json(updatedClientProfile);
  } catch (error) {
    console.error("Error updating client profile: ", error);
    return NextResponse.json(
      {
        message: "Failed to Update Client",
        error,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  // console.log(id);

  try {
    // Check if event exists
    const existingUser = await db.clientProfile.findUnique({
      where: { id },
      include: { user: true },
    });
    // console.log("existing user", existingUser?.user?.id);
    const existingUserId = existingUser?.user?.id;

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Delete the event from the database
    await db.user.delete({
      where: { id: existingUserId },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        message: "Failed to delete Client",
        error,
      },
      { status: 500 }
    );
  }
}
