import { getServerSession } from "next-auth";
import db from "@/lib/db"; // Adjust this according to your database setup
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = session.user.id;

    // Fetch the consultant profile with role and permissions
    const consultant = await db.consultantProfile.findUnique({
      where: { userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true, // Fetch permission names
              },
            },
          },
        },
      },
    });

    if (!consultant) {
      return res.status(404).json({ message: "Consultant profile not found" });
    }

    // Structure the response
    const response = {
      role: consultant.role.name,
      permissions: consultant.role.permissions.map((p) => p.permission.name), // Extract permission names
    };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
