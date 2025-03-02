const db = require("../src/lib/db");

async function main() {
  // console.log("Seeding database...");

  // Create Permissions
  const permissions = [
    { name: "postJob" },
    { name: "editJob" },
    { name: "deleteJob" },
    { name: "bulkUpload" },
    { name: "addCandidate" },
    { name: "editCandidate" },
    { name: "deleteCandidate" },
    { name: "sendMail" },
    { name: "assignTag" },
    { name: "assignJob" },
    { name: "addClient" },
    { name: "editClient" },
    { name: "deleteClient" },
    { name: "addConsultant" },
    { name: "editConsultant" },
    { name: "deleteConsultant" },
    { name: "manageConsultant" },
    { name: "addMailTemplate" },
    { name: "editMailTemplate" },
    { name: "deleteMailTemplate" },
    { name: "addTag" },
    { name: "editTag" },
    { name: "deleteTag" },
    { name: "addCompany" },
    { name: "editCompany" },
    { name: "deleteCompany" },
    { name: "addSector" },
    { name: "editSector" },
    { name: "deleteSector" },
    { name: "changeCandidateStatus" },
  ];

  const createdPermissions = await Promise.all(
    permissions.map((perm) =>
      db.permission.upsert({
        where: { name: perm.name },
        update: {},
        create: perm,
      })
    )
  );

  // Create Roles with Assigned Permissions
  const roles = [
    {
      name: "Consultant",
      permissions: [
        "sendMail",
        "assignJob",
        "assignTag",
        "addTag",
        "editTag",
        "deleteTag",
        "changeCandidateStatus",
      ],
    },
    {
      name: "Senior Consultant",
      permissions: [
        "sendMail",
        "assignJob",
        "assignTag",
        "addTag",
        "editTag",
        "deleteTag",
        "changeCandidateStatus",
        "postJob",
        "editJob",
        "deleteJob",
        "addCandidate",
        "editCandidate",
      ],
    },
    {
      name: "Team Leader",
      permissions: [
        "sendMail",
        "assignJob",
        "assignTag",
        "addTag",
        "editTag",
        "deleteTag",
        "changeCandidateStatus",
        "postJob",
        "editJob",
        "deleteJob",
        "addCandidate",
        "editCandidate",
        "addClient",
        "editClient",
        "deleteClient",
        "addMailTemplate",
        "editMailTemplate",
        "deleteMailTemplate",
        "addCompany",
        "editCompany",
        "deleteCompany",
      ],
    },
    {
      name: "Admin Consultant",
      permissions: [
        "sendMail",
        "assignJob",
        "assignTag",
        "addTag",
        "editTag",
        "deleteTag",
        "changeCandidateStatus",
        "postJob",
        "editJob",
        "deleteJob",
        "addCandidate",
        "editCandidate",
        "addClient",
        "editClient",
        "deleteClient",
        "addMailTemplate",
        "editMailTemplate",
        "deleteMailTemplate",
        "addCompany",
        "editCompany",
        "deleteCompany",
        "bulkUpload",
        "addSector",
        "editSector",
        "deleteSector",
        "addConsultant",
        "editConsultant",
        "deleteConsultant",
        "manageConsultant",
      ],
    },
  ];

  for (const role of roles) {
    const createdRole = await db.role.upsert({
      where: { name: role.name },
      update: {},
      create: { name: role.name },
    });

    const rolePermissions = role.permissions
      .map((permName) => {
        const foundPermission = createdPermissions.find(
          (p) => p.name === permName
        );
        if (!foundPermission) {
          console.error(`Permission not found for ${permName}`);
          return null; // Skip if not found
        }
        return {
          roleId: createdRole.id,
          permissionId: foundPermission.id,
        };
      })
      .filter(Boolean); // Remove null values

    if (rolePermissions.length > 0) {
      await db.rolePermission.createMany({ data: rolePermissions });
    }
  }

  // console.log("Database seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
