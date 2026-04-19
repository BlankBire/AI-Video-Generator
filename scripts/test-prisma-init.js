const fs = require("fs");
const path = require("path");
(async () => {
  try {
    console.log("node version", process.version);
    console.log("v8 version", process.versions.v8);
    const engineEnv =
      process.env.PRISMA_QUERY_ENGINE_LIBRARY || process.argv[2];
    console.log("PRISMA_QUERY_ENGINE_LIBRARY:", engineEnv);
    if (engineEnv) console.log("engine exists:", fs.existsSync(engineEnv));
    try {
      if (engineEnv && fs.existsSync(engineEnv)) {
        console.log("Attempting to require engine directly:");
        try {
          const eng = require(engineEnv);
          console.log(
            "engine require succeeded, type:",
            typeof eng,
            Object.keys(eng || {}).slice(0, 10),
          );
        } catch (e) {
          console.error("engine require error:", e && e.message);
        }
      }
    } catch (e) {
      console.error("error checking engine file:", e);
    }

    const { PrismaClient } = require("@prisma/client");
    const p = new PrismaClient();
    console.log("PrismaClient constructed");
    await p.$connect();
    console.log("Prisma connected");
    await p.$disconnect();
    console.log("Prisma disconnected");
  } catch (e) {
    console.error("ERROR", (e && e.stack) || e);
    process.exit(1);
  }
})();
