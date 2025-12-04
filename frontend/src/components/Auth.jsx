import React, { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4001";

// Authentication component for login and registration
export default function Auth({ onLogin, initialMode = "login", onClose }) {
  const [mode, setMode] = useState(initialMode); // Current mode: 'login' or 'register'
  const [username, setUsername] = useState(""); // Username input state
  const [password, setPassword] = useState(""); // Password input state
  const [loading, setLoading] = useState(false); // Loading state for API requests

  // Update mode when the initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Handle form submission for login or registration
  async function submit(e) {
    e && e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        // Login API call
        const res = await axios.post(API + "/api/auth/login", {
          username,
          password,
        });
        const { token, user } = res.data;
        onLogin(token, user);
        if (onClose) onClose();
      } else {
        // Registration API call
        await axios.post(API + "/api/auth/register", { username, password });
        setMode("login");
        alert("Registered — please login");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {/* Form for username and password input */}
      <form
        onSubmit={submit}
        style={{ display: "flex", gap: 8, alignItems: "center" }}
      >
        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn" disabled={loading} type="submit">
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
      {/* Toggle between login and registration modes */}
      <button
        style={{
          background: "transparent",
          border: "none",
          color: "#2563eb",
          cursor: "pointer",
        }}
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Create account" : "Have an account?"}
      </button>
    </div>
  );
}
