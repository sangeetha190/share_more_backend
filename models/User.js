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
    },
    role: {
      type: String,
      required: true,
      default: "user", // Default role is set to "user"
    },
    loginType: {
      type: Number,
      required: true,
      default: 3, // Default login type is set to 3
      // 1.Admin
      // 2.support team
      // 3.user
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
