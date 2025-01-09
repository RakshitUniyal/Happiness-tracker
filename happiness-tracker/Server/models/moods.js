const mongoose = require("mongoose");

// Define Mood Schema
const MoodSchema = new mongoose.Schema({
  mood: { type: String, required: true },
  date: { type: Date, default: Date.now },
  sentiment: {
    score: { type: Number }, // Sentiment score
    category: { type: String }, // Sentiment category (positive, negative, neutral)
  },
});

module.exports = mongoose.model("Mood", MoodSchema);
