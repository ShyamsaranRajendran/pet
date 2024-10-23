import React, { useState } from "react";
import axios from "axios"; // Import axios
import "./css/logincss.css"; // Import the CSS file

// Replace this with your actual API URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// Login API function
const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, credentials);
    return response.data;
  } catch (error) {
    // Handle error response and throw a user-friendly message
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear error messages
    setSuccessMessage(""); // Clear success messages

    try {
      const data = await loginUser(credentials);
      setSuccessMessage(data.message || "Login successful!");

      // Set the token in local storage
      localStorage.setItem("authentication", data.token);

      // Redirect user based on status
      if (data.status === 1) {
        window.location.href = "/dashboard"; // Redirect to dashboard if login successful
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.message); // Set error message
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back to Pet Zen!</h2>
      <p className="intro-text">
        Login to access your account and discover new pets waiting for a home.
        If you don’t have an account, sign up to join our community.
      </p>

      {/* Display error or success messages */}
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={credentials.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={credentials.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>

      <div className="login-options">
        <a href="/forgot-password" className="forgot-link">
          Forgot Password?
        </a>
        <p>
          Don't have an account?{" "}
          <a href="/register" className="signup-link">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
