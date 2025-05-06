// controllers/registrationController.js
const Registration = require("../models/registrationModel");
const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address (must allow less secure apps or use OAuth2)
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

const registerParticipant = async (req, res) => {
  try {
    const { participants, email, transactionId, amountPaid } = req.body;

    // Check if screenshot is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Payment screenshot is required" });
    }

    // Save registration details to MongoDB
    const registration = new Registration({
      participants: JSON.parse(participants), // Parsing the participants array
      email,
      transactionId,
      amountPaid,
      paymentScreenshotUrl: `/uploads/screenshots/${req.file.filename}`,
    });

    await registration.save();

    // Prepare the email content
    const participantsArray = JSON.parse(participants);
    const participantDetails = participantsArray
      .map(
        (p, index) =>
          `Participant ${index + 1}: \nName: ${p.name} \nContact: ${p.contact} \nGender: ${p.gender} \nEmail: ${p.email}\n`
      )
      .join("\n");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registration Confirmation for Football Event",
      text: `Dear Participant,

Thank you for registering for the football event.
The event details are as follows:

11th May (Wednesday)

7:45pm - 10:00pm(IST)

Palegaon Turf, Ambernath(E)

Here are your registration details:

Transaction ID: ${transactionId}
Amount Paid: ₹${amountPaid}

Participant Details:
${participantDetails}

A screenshot of your payment has been received.

Best Regards,
Amigos.11`,
    };

    // Send the confirmation email to the participant
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(201).json({ message: "Registration successful, confirmation email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerParticipant };
