import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/register", { username, password });
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
    <form onSubmit={handleRegister}>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
