const mongoose = require("mongoose");

// Define the schema for the Day model
const daySchema = new mongoose.Schema({
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
  maxMember: {
    type: Number,
    required: true,
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  charityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization", // Reference to the Charity model
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ["collect", "visit"], // Add an enum for the action
    required: true,
  },
});

// Create the Day model from the schema
const FoodDay = mongoose.model("FoodDay", daySchema);

module.exports = FoodDay;
