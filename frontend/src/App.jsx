import React, { useEffect, useState } from "react";
import Upload from "./components/Upload";
import Library from "./components/Library";
import Auth from "./components/Auth";
import axios from "axios";

export default function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(null); // 'login' | 'register' | null
  const [route, setRoute] = useState("home"); // 'home' | 'upload' | 'library'

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    }
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  function onLogin(token, userObj) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userObj);
    setShowAuth(null);
  }

  function onLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  }

  function navTo(r) {
    setRoute(r);
  }

  return (
    <div
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand" onClick={() => navTo("home")}>
            <div className="logo">PulseVid</div>
            <div className="muted">pulsevid-video platform</div>
          </div>

          <nav className="nav">
            <a
              className={route === "home" ? "nav-link active" : "nav-link"}
              onClick={() => navTo("home")}
            >
              Home
            </a>
            {user && (
              <a
                className={route === "upload" ? "nav-link active" : "nav-link"}
                onClick={() => navTo("upload")}
              >
                Upload
              </a>
            )}
            <a
              className={route === "library" ? "nav-link active" : "nav-link"}
              onClick={() => navTo("library")}
            >
              Library
            </a>
          </nav>

          <div>
            {user ? (
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontSize: 13 }}>
                  <strong>{user.username}</strong>{" "}
                  <span className="muted">({user.role})</span>
                </div>
                <button className="btn" onClick={onLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => setShowAuth("login")}>
                  Login
                </button>
                <button
                  className="btn"
                  style={{ background: "#10b981" }}
                  onClick={() => setShowAuth("register")}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={{ padding: "24px 16px" }}>
        {route === "home" && (
          <div className="hero">
            <div className="hero-card">
              <h1 className="hero-title">
                Secure, scalable video sensitivity analysis
              </h1>
              <p className="hero-sub">
                pulsevid-video platform — upload videos, get real-time
                processing updates, and securely stream processed content.
              </p>

              <div className="hero-ctas">
                {!user ? (
                  <>
                    <button
                      className="btn"
                      onClick={() => setShowAuth("login")}
                    >
                      Login
                    </button>
                    <button
                      className="btn"
                      style={{ background: "#10b981" }}
                      onClick={() => setShowAuth("register")}
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn" onClick={() => navTo("upload")}>
                      Go to Upload
                    </button>
                    <button
                      className="btn"
                      style={{ background: "#10b981" }}
                      onClick={() => navTo("library")}
                    >
                      Open Library
                    </button>
                  </>
                )}
              </div>

              {showAuth && !user && (
                <div style={{ marginTop: 18 }}>
                  <Auth
                    initialMode={showAuth}
                    onLogin={onLogin}
                    onClose={() => setShowAuth(null)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {route === "upload" && (
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <Upload currentUser={user} />
          </div>
        )}

        {route === "library" && (
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <Library currentUser={user} />
          </div>
        )}
      </main>
    </div>
  );
}
