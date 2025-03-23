const states = require("./states.json");
const districts = require("./districts.json");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding states...");

  // 1️⃣ Insert states and store mapping
  const stateMapping = {};
  for (const state of states) {
    const createdState = await prisma.state.create({
      data: {
        state_code: state.state_code,
        state_name: state.state_name,
      },
    });
    stateMapping[state.id] = createdState.id; // Store new ObjectId reference
  }

  console.log("Seeding districts...");

  // 2️⃣ Insert districts with mapped state IDs
  for (const district of districts) {
    const stateId = stateMapping[district.ref_state_id];

    if (!stateId) {
      console.warn(
        `⚠️ Skipping district "${district.district_name}" (Invalid state ID: ${district.ref_state_id})`
      );
      continue;
    }

    await prisma.district.create({
      data: {
        district_name: district.district_name,
        stateId: stateId,
      },
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => console.error("❌ Seeding error:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });
