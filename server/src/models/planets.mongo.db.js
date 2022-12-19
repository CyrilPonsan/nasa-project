const mongoose = require("mongoose");

const planetSchema = mongoose.Schema({
  keplerName: { type: String, required: true },
});

//  Connects the model with the launches collection
module.exports = mongoose.model("Planet", planetSchema);
