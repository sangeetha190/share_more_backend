const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampScheduleSchema = new Schema(
  {
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    address: {
      type: String,
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
    time: {
      type: String,
      required: true,
    },
    approx_donor: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CampSchedule = mongoose.model("CampSchedule", CampScheduleSchema);

module.exports = CampSchedule;
