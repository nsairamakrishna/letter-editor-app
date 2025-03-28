import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LetterEditor from "../components/LetterEditor.jsx";
import "./Home.css";

// Store token from URL in localStorage
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
if (token) {
  localStorage.setItem("token", token);
  window.history.replaceState({}, document.title, "/home"); // Remove token from URL
}

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      navigate("/"); // Redirect to login if no token is found
      return;
    }

    axios
      .get("https://letter-editor-app.onrender.com/auth/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`, // Send token in Authorization header
        },
      })
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Auth error:", err);
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token on logout
    axios
      .get("https://letter-editor-app.onrender.com/auth/logout", { withCredentials: true })
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => console.error("Logout failed", error));
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h2 className="navbar-title">Letter Editor</h2>
        {user && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </nav>

      <div className="home-content">
        {user ? (
          <>
            <h1 className="welcome-message">Welcome, {user.name}!</h1>
            <LetterEditor />
          </>
        ) : (
          <p className="loading-text">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
