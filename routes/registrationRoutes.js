// routes/registrationRoutes.js
const express = require("express");
const multer = require("multer");
const registrationController = require("../controllers/registrationController");
const path = require("path");

// Setup file storage for screenshots
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/screenshots"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

const router = express.Router();

// Register route with screenshot upload
router.post("/register", upload.single("screenshot"), registrationController.registerParticipant);

module.exports = router;
