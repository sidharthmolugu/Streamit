import React, { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4001";

// Authentication component for login and registration
export default function Auth({ onLogin, initialMode = "login", onClose }) {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        // LOGIN (COOKIE-BASED AUTH)
        const res = await axios.post(
          `${API}/api/auth/login`,
          { username, password },
          { withCredentials: true } // REQUIRED
        );

        // Backend now returns ONLY user (token is in cookie)
        const { user } = res.data;

        // Notify parent app that login succeeded
        onLogin(user);

        if (onClose) onClose();
      } else {
        // REGISTER
        await axios.post(
          `${API}/api/auth/register`,
          { username, password },
          { withCredentials: true }
        );

        alert("Registered — please login");
        setMode("login");
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
