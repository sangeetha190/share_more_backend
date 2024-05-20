// donor_appointment.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonorAppointmentSchema = new Schema(
  {
    donor_id: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the Donor model
      required: true,
    },
    appointment_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending",
    },
    unique_id: {
      type: String,
      required: true,
      unique: true,
    },
    reminder_sent: {
      type: Boolean,
      default: false,
    },
    reminder_date: {
      type: Date,
    },
    reminder_method: {
      type: String,
      enum: ["email", "sms", "none"],
      default: "none",
    },
  },
  {
    timestamps: true,
  }
);

const DonorAppointment = mongoose.model(
  "DonorAppointment",
  DonorAppointmentSchema
);

module.exports = DonorAppointment;
