export const dynamic = "force-dynamic"; // Ensures this route is always handled dynamically
import { getServerSession } from "next-auth";
import db from "@/lib/db"; // Adjust this according to your database setup
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
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
      return new Response(
        JSON.stringify({ message: "Consultant profile not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
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
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
