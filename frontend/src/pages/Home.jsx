import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LetterEditor from "../components/LetterEditor.jsx"; // Import the Letter Editor
import "./Home.css"; // Import the CSS file

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/user", { withCredentials: true }) // Ensure withCredentials is included
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          navigate("/"); // Redirect to login if not authenticated
        }
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleLogout = () => {
    axios
      .get("http://localhost:5000/auth/logout", { withCredentials: true })
      .then(() => {
        window.location.href = "/"; // Redirect manually after successful logout
      })
      .catch((error) => console.error("Logout failed", error));
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="navbar-title">Letter Editor</h2>
        {user && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </nav>

      {/* Home Content */}
      <div className="home-content">
        {user ? (
          <>
            <h1 className="welcome-message">Welcome, {user.name}!</h1>
            
            <LetterEditor /> {/* Display the Letter Editor */}
          </>
        ) : (
          <p className="loading-text">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
