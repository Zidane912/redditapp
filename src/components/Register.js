import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://ec2-52-56-192-208.eu-west-2.compute.amazonaws.com/register", { username, password });
      if (response.status === 201) {
        navigate("/");
      } else {
        alert("User registration failed");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("User registration failed");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <div>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
        <div className="back-to-signin">
          <Link to="/" className="btn back-btn">Back to Sign In</Link>
        </div>
        <div>
        <p className="warning-message justify-content-between align-items-center"><b className="warning">WARNING</b> This is a test project, please do not use any of your real passwords to register</p>
        </div>
      </form>
    </div>
  );
};

export default Register;
