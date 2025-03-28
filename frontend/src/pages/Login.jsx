import React from "react";
import styles from "./Login.module.css";

const Login = () => {
  const handleLogin = () => {
    window.location.href = "https://letter-editor-app.onrender.com/auth/google"; // Direct OAuth redirection
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
