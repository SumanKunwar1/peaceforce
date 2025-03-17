import express from "express";
import cors from "cors";
import { corsOptions } from "@config/cors";
import router from "@routes";
import { handleResponse } from "@utils/handleResponse"; // Import handleResponse
import { handleError } from "@utils/handleError";

const app = express();
app.use(express.json({ limit: "10mb" })); // Increase limit for JSON payload to 10MB
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// Middleware setup
app.use(cors(corsOptions));
app.use("/api", router);

app.use(handleResponse);
app.use(handleError);

// Root endpoint
app.get("/", (req, res) => {
  console.log("Root endpoint hit (GET /)");
  res.send("Hello, World!");
});

export default app;
