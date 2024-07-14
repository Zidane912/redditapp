import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

const SignIn = ({ onSignIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://ec2-52-56-192-208.eu-west-2.compute.amazonaws.com/signIn", { username, password });
      if (response.status === 200 && response.data.authenticated) {
        onSignIn(true, response.data.user);
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setErrorMessage("Please check you have used the correct login details");
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSignIn}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign In</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
