// src/app/api/activities/[id]/route.js
import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params;
  // console.log(id);

  try {
    // Check if event exists
    const existingUser = await db.candidateProfile.findUnique({
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
        message: "Failed to delete event",
        error,
      },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const { tagId } = params;
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
        where: {
          candidateTags: {
            some: { tagId: tagId }, // Correct filtering for many-to-many relation
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

    // console.log("backedbdbjbx", assignedDistrictIds);

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
        candidateTags: {
          some: { tagId: tagId }, // Correct filtering for many-to-many relation
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
