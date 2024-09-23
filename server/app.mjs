import express from "express";
import apiRoutes from "./routes/api.mjs"; // Import API routes
import dotenv from "dotenv";

// Initialize environment variables
dotenv.config();

const app = express();
app.use(express.json()); // Parse JSON

// Link your API routes
app.use("/api", apiRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
