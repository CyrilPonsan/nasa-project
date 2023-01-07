const mongoose = require("mongoose");

const planetSchema = mongoose.Schema({
  keplerName: { type: String, required: true },
});

//  Connects the model collection
module.exports = mongoose.model("Planet", planetSchema);
