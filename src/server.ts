// Import the app configuration we just built.
// Note: NodeNext module resolution requires explicit '.js' extensions in imports, even for TypeScript files!
import app from "./app.js";
// Import dotenv to read variables inside your local .env file
import dotenv from "dotenv";

// Inject the variables written in your .env file straight into Node's `process.env` globally
dotenv.config();

// Define the port the server will open on. Read it from environment variables, or fallback to 5000
const PORT = process.env.PORT || 5000;

// Tell Express to start listening for incoming network requests on your specified port
app.listen(PORT, () => {
  // This callback executes only when the server has successfully booted up and bound to the port
  console.log(`🚀 Lumina Space Backend running on http://localhost:${PORT}`);
});
