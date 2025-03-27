// backend/models/Letter.js
const mongoose = require("mongoose");

const LetterSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Letter", LetterSchema);
