const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: {
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
  type: {
    type: String,
    enum: ["charity", "hospital", "blood bank"],
    required: true,
  },
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
