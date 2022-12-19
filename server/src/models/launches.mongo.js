const mongoose = require("mongoose");

const launchesSchema = mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  customers: {
    type: [String],
  },
  upcoming: { type: Boolean, required: true, default: true },
  success: { type: Boolean, required: true, default: true },
});

//  Connects the model with the launches collection
module.exports = mongoose.model("Launch", launchesSchema);
