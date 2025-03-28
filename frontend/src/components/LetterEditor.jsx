import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "./LetterEditor.css";

// Configure Axios globally
axios.defaults.baseURL = "https://letter-editor-app.onrender.com";
axios.defaults.withCredentials = true; // Ensure cookies are sent

const LetterEditor = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [letters, setLetters] = useState([]);
  const [googleDriveLetters, setGoogleDriveLetters] = useState([]);
  const [message, setMessage] = useState(null);
  const [editingLetter, setEditingLetter] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLetters();
    fetchGoogleDriveLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const response = await axios.get("/api/letters");
      setLetters(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch letters:", error.response?.data || error.message);
      setMessage("Error fetching letters. Please try again.");
    }
  };

  const fetchGoogleDriveLetters = async () => {
    try {
      const response = await axios.get("/api/letters/google-drive-letters");
      setGoogleDriveLetters(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch Google Drive letters:", error.response?.data || error.message);
      setMessage("Error fetching Google Drive letters.");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editingLetter) {
        await axios.put(`/api/letters/${editingLetter._id}`, { title, content });
        setMessage("✅ Letter updated successfully!");
        setEditingLetter(null);
      } else {
        const response = await axios.post("/api/letters", { title, content });
        setMessage("✅ Letter saved successfully!");
        setLetters([...letters, response.data.letter]);
      }
      setTitle("");
      setContent("");
      fetchLetters();
    } catch (error) {
      console.error("❌ Error saving letter:", error.response?.data || error.message);
      setMessage("Failed to save/update letter.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadToGoogleDrive = async (id) => {
    setLoading(true);
    try {
      await axios.post(`/api/letters/upload-to-drive/${id}`);
      setMessage("✅ Letter uploaded to Google Drive!");
      fetchGoogleDriveLetters();
    } catch (error) {
      console.error("❌ Error uploading to Google Drive:", error.response?.data || error.message);
      setMessage("Failed to upload letter.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (letter) => {
    setEditingLetter(letter);
    setTitle(letter.title);
    setContent(letter.content);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/api/letters/${id}`);
      setMessage("✅ Letter deleted successfully!");
      setLetters(letters.filter((letter) => letter._id !== id));
    } catch (error) {
      console.error("❌ Error deleting letter:", error.response?.data || error.message);
      setMessage("Failed to delete letter.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFromGoogleDrive = async (fileId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/letters/google-drive-letters/${fileId}`);
      setMessage("✅ Letter deleted from Google Drive!");
      setGoogleDriveLetters(googleDriveLetters.filter((letter) => letter.id !== fileId));
    } catch (error) {
      console.error("❌ Error deleting from Google Drive:", error.response?.data || error.message);
      setMessage("Failed to delete from Google Drive.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="letter-editor-container">
      <h2>{editingLetter ? "Edit Letter" : "Create a Letter"}</h2>
      <input
        type="text"
        placeholder="Letter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="letter-title-input"
      />
      <ReactQuill value={content} onChange={setContent} className="text-editor" />
      <button onClick={handleSave} className="save-button" disabled={loading}>
        {editingLetter ? "Update Letter" : "Save Letter"}
      </button>

      {loading && <div className="loader">Processing...</div>}
      {message && <p className="message">{message}</p>}

      <h2>Saved Drafts</h2>
      {letters.length === 0 ? (
        <p className="no-letters">No saved letters.</p>
      ) : (
        letters.map((letter) => (
          <div key={letter._id} className="letter-card">
            <h3>{letter.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: letter.content }} />
            <button onClick={() => handleEdit(letter)} className="edit-button">Edit</button>
            <button onClick={() => handleDelete(letter._id)} className="delete-button">Delete</button>
            <button onClick={() => handleUploadToGoogleDrive(letter._id)} className="upload-button">
              Upload to Google Drive
            </button>
          </div>
        ))
      )}

      <h2>Saved Letters (Google Drive)</h2>
      {googleDriveLetters.length === 0 ? (
        <p className="no-letters">No letters in Google Drive.</p>
      ) : (
        googleDriveLetters.map((letter) => (
          <div key={letter.id} className="google-drive-card">
            <h3>{letter.name}</h3>
            <a href={`https://docs.google.com/document/d/${letter.id}`} target="_blank" rel="noopener noreferrer">
              View in Google Drive
            </a>
            <button onClick={() => handleDeleteFromGoogleDrive(letter.id)} className="delete-button">
              Delete from Drive
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default LetterEditor;
