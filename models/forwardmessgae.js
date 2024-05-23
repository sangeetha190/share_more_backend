const mongoose = require("mongoose");

const forwardedBloodDonationMessageSchema = new mongoose.Schema({
  forwardedMessage: {
    type: String,
    required: true,
  },
  bloodGroupForwarded: {
    type: String,
    required: true,
  },
  contactNumberForwarded: {
    type: String,
    required: true,
  },
  emailForwarded: {
    type: String,
    required: true,
  },
  userPastingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
});

const ForwardedBloodDonationMessage = mongoose.model(
  "ForwardedBloodDonationMessage",
  forwardedBloodDonationMessageSchema
);

module.exports = ForwardedBloodDonationMessage;
