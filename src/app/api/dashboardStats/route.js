import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id: userId, role } = session.user;

  const userData = await db.user.findUnique({
    where: { id: userId },
    include: {
      consultantProfile: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!userData) {
    return NextResponse.json(
      { message: "User data not found" },
      { status: 404 }
    );
  }

  const consultantId = userData?.consultantProfile?.id;
  const userRole = userData?.consultantProfile?.role?.name;

  const [
    candidateCount,
    manualCandidateCount,
    consultantCount,
    clientCount,
    companyCount,
    districtGroups,
    domainGroups,
  ] = await Promise.all([
    db.candidateProfile.count(),
    db.candidateProfile.count({ where: { bulkUpload: false } }),
    db.consultantProfile.count(),
    db.clientProfile.count(),
    db.company.count(),
    db.candidateProfile.groupBy({
      by: ["districtId"],
      _count: { _all: true },
    }),
    db.candidateProfile.groupBy({
      by: ["domainId"],
      _count: { _all: true },
    }),
  ]);

  const [districts, domains] = await Promise.all([
    db.district.findMany({
      select: { id: true, district_name: true },
    }),
    db.domain.findMany({
      select: { id: true, name: true },
    }),
  ]);

  const districtNameMap = Object.fromEntries(
    districts.map((d) => [d.id, d.district_name])
  );

  const domainNameMap = Object.fromEntries(domains.map((d) => [d.id, d.name]));

  const candidatesByDistrict = districtGroups.map((group) => ({
    id: group.districtId,
    label: districtNameMap[group.districtId] || "Unknown",
    value: group._count._all,
  }));

  const candidatesByDomain = domainGroups.map((group) => ({
    id: group.domainId,
    label: domainNameMap[group.domainId] || "Unknown",
    value: group._count._all,
  }));

  let jobStatsWithTitles = [];

  if (role === "CONSULTANT" && userRole === "Admin Consultant") {
    // const jobStats = await db.jobApplicant.groupBy({
    //   by: ["jobId"],
    //   _count: { _all: true },
    // });
    // Fetch all jobs
    const jobs = await db.job.findMany({
      select: { id: true, jobTitle: true },
    });

    // Count applicants for each job
    const jobApplicantCounts = await db.jobApplicant.groupBy({
      by: ["jobId"],
      _count: { _all: true },
    });
    // Create a map of jobId to applicant count
    const applicantCountMap = Object.fromEntries(
      jobApplicantCounts.map((stat) => [stat.jobId, stat._count._all])
    );
    // Combine job information with applicant counts
    jobStatsWithTitles = jobs.map((job) => ({
      id: job.id,
      label: job.jobTitle,
      value: applicantCountMap[job.id] || 0,
    }));
  } else if (
    role === "CONSULTANT" &&
    (userRole === "Team Leader" || userRole === "Consultant")
  ) {
    const assignedJobs = await db.jobAssignment.findMany({
      where: { consultantId: consultantId },
      select: { jobId: true },
    });

    const assignedJobIds = assignedJobs.map((assignment) => assignment.jobId);

    // Fetch job details for assigned jobs
    const jobs = await db.job.findMany({
      where: { id: { in: assignedJobIds } },
      select: { id: true, jobTitle: true },
    });

    // Count applicants for assigned jobs
    const jobApplicantCounts = await db.jobApplicant.groupBy({
      by: ["jobId"],
      where: { jobId: { in: assignedJobIds } },
      _count: { _all: true },
    });

    // Create a map of jobId to applicant count
    const applicantCountMap = Object.fromEntries(
      jobApplicantCounts.map((stat) => [stat.jobId, stat._count._all])
    );

    // Combine job information with applicant counts
    jobStatsWithTitles = jobs.map((job) => ({
      id: job.id,
      label: job.jobTitle,
      value: applicantCountMap[job.id] || 0,
    }));
  }

  return NextResponse.json(
    {
      candidateCount,
      manualCandidateCount,
      consultantCount,
      clientCount,
      companyCount,
      candidatesByDistrict,
      candidatesByDomain,
      jobStats: jobStatsWithTitles,
    },
    { status: 200 }
  );
}
