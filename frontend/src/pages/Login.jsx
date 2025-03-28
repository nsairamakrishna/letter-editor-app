import React from "react";
import styles from "./Login.module.css";

const Login = () => {
  const handleLogin = async () => {
    try {
      const response = await fetch("https://letter-editor-app.onrender.com/auth/google", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.redirectUrl;
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-box"]}>
        <h1 className={styles["login-title"]}>Welcome to the Letter Editor App</h1>
        <button onClick={handleLogin} className={styles["login-button"]}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
