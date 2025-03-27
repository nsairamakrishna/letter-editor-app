const { google } = require("googleapis");
const { Readable } = require("stream");
const dotenv = require("dotenv");
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

// Upload Letter as Google Docs
async function uploadLetterToDrive(title, content) {
  try {
    const fileMetadata = {
      name: title,
      mimeType: "application/vnd.google-apps.document",
    };

    const media = {
      mimeType: "text/html",
      body: Readable.from(`<html><body>${content}</body></html>`),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, name, webViewLink",
    });

    return file.data;
  } catch (error) {
    console.error("Error uploading letter to Google Drive:", error.message);
    throw new Error("Failed to upload letter to Google Drive");
  }
}

// Fetch list of Google Docs
async function getSavedLetters() {
  try {
    const res = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.document'",
      fields: "files(id, name, webViewLink)",
    });
    return res.data.files;
  } catch (error) {
    console.error("Error fetching letters from Google Drive:", error.message);
    throw new Error("Failed to fetch letters from Google Drive");
  }
}
// Delete a file from Google Drive
async function deleteLetterFromDrive(fileId) {
  try {
    await drive.files.delete({ fileId });
    return { message: "Letter deleted from Google Drive" };
  } catch (error) {
    console.error("Error deleting letter from Google Drive:", error.message);
    throw new Error("Failed to delete letter from Google Drive");
  }
}

module.exports = { uploadLetterToDrive, getSavedLetters, deleteLetterFromDrive };

