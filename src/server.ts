// Import the app configuration we just built.
// Note: NodeNext module resolution requires explicit '.js' extensions in imports, even for TypeScript files!
import app from "./app.js";
// Import dotenv to read variables inside your local .env file
import dotenv from "dotenv";
// Import your configured prisma instance to manage database interactions
import prisma from "./config/datebase";
dotenv.config();

// Inject the variables written in your .env file straight into Node's `process.env` globally

// Define the port the server will open on. Read it from environment variables, or fallback to 5000
const PORT = process.env.PORT || 5000;

/**
 * Temporary bypass function to force-create a test user on startup.
 * This guarantees a valid User row exists in Supabase so you can test your properties API.
 */
async function forceCreateUserBypass() {
  try {
    const user = await prisma.user.upsert({
      where: { email: "masum.dev@example.com" },
      update: {},
      create: {
        email: "masum.dev@example.com",
        name: "S M Mazharul Islam Masum",
      },
    });
    console.log("\n=================================================");
    console.log("👉 SUCCESS! COPY THIS USER ID FOR THUNDER CLIENT:");
    console.log(`   ${user.id}`);
    console.log("=================================================\n");
  } catch (err) {
    console.error("❌ Database user bypass initialization failed:", err);
  }
}

// Tell Express to start listening for incoming network requests on your specified port
app.listen(PORT, async () => {
  // This callback executes only when the server has successfully booted up and bound to the port
  console.log(`🚀 Talent Forge Backend running on http://localhost:${PORT}`);

  // Execute our database configuration test and seed bypass
  await forceCreateUserBypass();
});
