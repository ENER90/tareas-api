const mongoose = require("mongoose");

const PersonaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

module.exports = mongoose.model("Persona", PersonaSchema);
