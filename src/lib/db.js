// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");

const db = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV == "production") globalThis.prisma = db;

// export default db;
module.exports = db;
