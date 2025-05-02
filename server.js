// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const registrationRoutes = require("./routes/registrationRoutes");
const Registration = require("./models/registrationModel");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Static route for images


app.get("/api/registrations", async (req, res) => {
    try {
      const all = await Registration.find();
  
      const baseUrl = "https://footballevent-backend.onrender.com"; // or use process.env.BASE_URL for production
      const updated = all.map((registration) => {
        return {
          ...registration._doc,
          paymentScreenshotUrl: registration.paymentScreenshotUrl
            ? `${baseUrl}${registration.paymentScreenshotUrl}`
            : null,
        };
      });
  
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  });
  

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use registration routes
app.use("/api", registrationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
