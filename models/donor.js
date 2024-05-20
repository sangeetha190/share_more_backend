// donor.js
const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
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
    status: {
      type: String,
      enum: ["married", "single"],
      default: "single",
    },
    bloodType: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "donor",
    },
    loginType: {
      type: Number,
      required: true,
      default: 4,
    },
    otp: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Donor = mongoose.model("Donor", DonorSchema);

module.exports = Donor;
