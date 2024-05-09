const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
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
      required: true,
    },
    contactNumber: {
      type: Number,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit number"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", UserSchema);

module.exports = User;
