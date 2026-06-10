require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.send("API is running");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB connection error:", err));

// Song model
const Song = mongoose.model("Song", new mongoose.Schema({
  title: String,
  artist: String,
  album: String,
  favorite: { type: Boolean, default: false },
  cover: String
}), "Music");

// Routes
app.get("/songs", async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

app.post("/songs", async (req, res) => {
  const song = new Song(req.body);
  await song.save();
  res.json(song);
});

app.patch("/songs/:id/favorite", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    song.favorite = !song.favorite;
    await song.save();
    res.json(song);
  } catch {
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
});

app.delete("/songs/:id", async (req, res) => {
  await Song.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
