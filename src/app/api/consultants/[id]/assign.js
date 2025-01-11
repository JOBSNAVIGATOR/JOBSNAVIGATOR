import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { id } = req.query;
  const { sectors, domains, locations } = req.body;

  try {
    await prisma.consultantProfile.update({
      where: { id },
      data: {
        assignedSectors: sectors,
        assignedDomains: domains,
        assignedLocations: locations,
      },
    });

    return res
      .status(200)
      .json({ message: "Assignments updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error updating assignments" });
  }
}
