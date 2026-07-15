import express from "express";

import cors from "cors";

import dotenv from "dotenv";
import { prisma } from "../lib/prisma.js";
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Welcome to EchoHire AI Backend",
  });
});

app.get("/user", async (req, res) => {
  try {
    console.log("Fetching users from the database...");
    const user = await prisma.user.findMany();
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
});

app.post("/create", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
