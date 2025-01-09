const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const Sentiment = require("sentiment");
const sentiment = new Sentiment();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const Mood = require("./models/moods.js");

app.post("/mood", async (req, res) => {
  const { mood } = req.body; // Get the mood text
  if (!mood) {
    return res.status(400).json({ message: "Mood is required" });
  }

  try {
    // Perform sentiment analysis
    const sentimentResult = sentiment.analyze(mood);
    const sentimentScore = sentimentResult.score; // Sentiment score
    const sentimentCategory =
      sentimentScore > 0
        ? "positive"
        : sentimentScore < 0
        ? "negative"
        : "neutral";

    // Create a new mood log
    const newMood = new Mood({
      mood,
      sentiment: {
        score: sentimentScore,
        category: sentimentCategory,
      },
    });
    console.log(mood);
    await newMood.save(); // Save to MongoDB
    res.json(newMood); // Respond with the new mood log
  } catch (err) {
    res.status(500).json({ message: "Error saving mood" });
  }
});

app.get("/mood", async (req, res) => {
  try {
    const moods = await Mood.find();
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: "Error fetching moods" });
  }
});
app.get("/", (req, res) => res.send("Happiness Tracker API Running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
