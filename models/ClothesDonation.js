const mongoose = require("mongoose");

// Define the schema for the Day model
const clothesdontionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
});

// Create the Day model from the schema
const ClothesDonation = mongoose.model("ClothesDonation", clothesdontionSchema);

module.exports = ClothesDonation;
