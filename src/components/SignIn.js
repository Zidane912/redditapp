import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

const SignIn = ({ onSignIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/signIn", { username, password });
      if (response.status === 200 && response.data.authenticated) {
        onSignIn(true, response.data.user);
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSignIn}>
        <div>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Sign In</button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;