const mongoose = require("mongoose");

const PersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

module.exports = mongoose.model("Person", PersonSchema);
