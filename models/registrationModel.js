// models/registrationModel.js
const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  participants: [
    {
      name: { type: String, required: true },
      contact: { type: String, required: true },
      gender: { type: String, required: true },
      email: { type: String, required: true },
    },
  ],
  transactionId: { type: String, required: true },
    email: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  paymentScreenshotUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Registration = mongoose.model("Registration", RegistrationSchema);

module.exports = Registration;
