const express = require("express");
const router = express.Router();
const Letter = require("../models/Letter");
const { uploadLetterToDrive, getSavedLetters } = require("../utils/googleDrive");
const { deleteLetterFromDrive } = require("../utils/googleDrive");

router.delete("/google-drive-letters/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    const response = await deleteLetterFromDrive(fileId);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete letter from Google Drive" });
  }
});

// Get all letters from MongoDB
router.get("/", async (req, res) => {
  try {
    const letters = await Letter.find();
    res.json(letters);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching letters" });
  }
});

// Save a new letter as a draft in MongoDB
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const newLetter = new Letter({ title, content });
    await newLetter.save();

    res.json({ message: "Draft saved successfully", letter: newLetter });
  } catch (error) {
    res.status(500).json({ message: "Error saving draft" });
  }
});

// Upload an existing letter to Google Drive
router.post("/upload-to-drive/:id", async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.id);
    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    // Upload letter to Google Drive
    const driveResponse = await uploadLetterToDrive(letter.title, letter.content);

    res.json({ message: "Letter uploaded to Google Drive", googleDriveFile: driveResponse });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload letter to Google Drive" });
  }
});

// Update a letter in MongoDB
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedLetter = await Letter.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    res.json(updatedLetter);
  } catch (error) {
    res.status(500).json({ message: "Failed to update letter" });
  }
});

// Delete a letter
router.delete("/:id", async (req, res) => {
  try {
    await Letter.findByIdAndDelete(req.params.id);
    res.json({ message: "Letter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete letter" });
  }
});

// Fetch saved letters from Google Drive
router.get("/google-drive-letters", async (req, res) => {
  try {
    const files = await getSavedLetters();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved letters" });
  }
});

module.exports = router;
