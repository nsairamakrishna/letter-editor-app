import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "./LetterEditor.css";

const LetterEditor = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [letters, setLetters] = useState([]);
  const [googleDriveLetters, setGoogleDriveLetters] = useState([]);
  const [message, setMessage] = useState(null);
  const [editingLetter, setEditingLetter] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    fetchLetters();
    fetchGoogleDriveLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/letters", { withCredentials: true });
      setLetters(response.data);
    } catch (error) {
      console.error("Failed to fetch letters", error);
    }
  };

  const fetchGoogleDriveLetters = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/letters/google-drive-letters", { withCredentials: true });
      setGoogleDriveLetters(response.data);
    } catch (error) {
      console.error("Failed to fetch Google Drive letters", error);
    }
  };

  const handleSave = async () => {
    setLoading(true); // Set loading to true before the request starts
    try {
      if (editingLetter) {
        await axios.put(`http://localhost:5000/api/letters/${editingLetter._id}`, { title, content }, { withCredentials: true });
        setMessage("Letter updated successfully!");
        setEditingLetter(null);
      } else {
        const response = await axios.post("http://localhost:5000/api/letters", { title, content }, { withCredentials: true });
        setMessage("Letter saved successfully!");
        setLetters([...letters, response.data.letter]);
      }
      setTitle("");
      setContent("");
      fetchLetters();
    } catch (error) {
      setMessage("Failed to save/update letter.");
    } finally {
      setLoading(false); // Set loading to false once the request is finished
    }
  };

  const handleUploadToGoogleDrive = async (id) => {
    setLoading(true); // Set loading to true before the request starts
    try {
      await axios.post(`http://localhost:5000/api/letters/upload-to-drive/${id}`, {}, { withCredentials: true });
      setMessage("Letter uploaded to Google Drive!");
      fetchGoogleDriveLetters();
    } catch (error) {
      setMessage("Failed to upload letter to Google Drive.");
    } finally {
      setLoading(false); // Set loading to false once the request is finished
    }
  };

  const handleEdit = (letter) => {
    setEditingLetter(letter);
    setTitle(letter.title);
    setContent(letter.content);
  };

  const handleDelete = async (id) => {
    setLoading(true); // Set loading to true before the request starts
    try {
      await axios.delete(`http://localhost:5000/api/letters/${id}`, { withCredentials: true });
      setMessage("Letter deleted successfully!");
      setLetters(letters.filter((letter) => letter._id !== id));
    } catch (error) {
      setMessage("Failed to delete letter.");
    } finally {
      setLoading(false); // Set loading to false once the request is finished
    }
  };

  const handleDeleteFromGoogleDrive = async (fileId) => {
    setLoading(true); // Set loading to true before the request starts
    try {
      await axios.delete(`http://localhost:5000/api/letters/google-drive-letters/${fileId}`, { withCredentials: true });
      setMessage("Letter deleted from Google Drive!");
      setGoogleDriveLetters(googleDriveLetters.filter((letter) => letter.id !== fileId));
    } catch (error) {
      setMessage("Failed to delete letter from Google Drive.");
    } finally {
      setLoading(false); // Set loading to false once the request is finished
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
      <button onClick={handleSave} className="save-button">
        {editingLetter ? "Update Letter" : "Save Letter"}
      </button>

      {loading && <div className="loader">Saving...</div>} {/* Display loader when loading is true */}

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
      {googleDriveLetters.map((letter) => (
        <div key={letter.id} className="google-drive-card">
          <h3>{letter.name}</h3>
          <a href={`https://docs.google.com/document/d/${letter.id}`} target="_blank" rel="noopener noreferrer">
            View in Google Drive
          </a>
          <button onClick={() => handleDeleteFromGoogleDrive(letter.id)} className="delete-button">
            Delete from Drive
          </button>
        </div>
      ))}
    </div>
  );
};

export default LetterEditor;
