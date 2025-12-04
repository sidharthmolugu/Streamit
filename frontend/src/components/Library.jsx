import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const API = import.meta.env.VITE_API_URL || "http://localhost:4001";
const SOCKET = io(API);

// Component to render a video player for a specific video
function VideoPlayer({ video }) {
  const src = API + "/api/videos/stream/" + video.filename;
  return (
    <div className="video-player">
      <h4>
        {video.originalName} —{" "}
        <span className={`badge badge-${video.sensitivity || "unknown"}`}>
          {video.sensitivity || "unknown"}
        </span>
      </h4>
      <video controls style={{ width: "100%", maxWidth: 720 }}>
        <source src={src} type="video/mp4" />
        Your browser does not support video.
      </video>
    </div>
  );
}

// Main Library component to display a list of videos
export default function Library({ currentUser }) {
  const [videos, setVideos] = useState([]);

  // Fetch the list of videos on component mount
  useEffect(() => {
    fetchList();

    // Listen for real-time updates on video processing
    const handler = (d) => {
      if (!d || !d.videoId) return;
      setVideos((prev) =>
        prev.map((v) => {
          if (String(v._id) === String(d.videoId)) {
            return {
              ...v,
              status: d.status || v.status,
              _processingProgress: d.progress,
              sensitivity: d.sensitivity || v.sensitivity,
            };
          }
          return v;
        })
      );
      // If the video is not in the list, refresh the list
      if (!videos.find((x) => String(x._id) === String(d.videoId))) fetchList();
    };

    SOCKET.on("processing", handler);
    return () => {
      SOCKET.off("processing", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch the list of videos from the API
  async function fetchList() {
    try {
      const res = await axios.get(API + "/api/videos");
      setVideos(res.data.videos);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    }
  }

  // Handle video deletion
  async function handleDelete(id) {
    if (!currentUser) return alert("Login required");
    if (!confirm("Delete this video?")) return;
    try {
      await axios.delete(API + "/api/videos/" + id);
      setVideos(videos.filter((v) => v._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  // Override video sensitivity (admin/editor only)
  async function overrideSensitivity(id, value) {
    if (!currentUser) return alert("Login required");
    try {
      await axios.patch(API + "/api/videos/" + id, { sensitivity: value });
      fetchList();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  return (
    <div>
      <h2>Library</h2>
      {videos.length === 0 && <p>No videos yet.</p>}
      {videos.map((v) => (
        <div key={v._id} className="video-card">
          <div className="video-card-head">
            <div>
              <strong>{v.originalName}</strong>
              <div className="muted">
                {new Date(v.createdAt).toLocaleString()} • Uploaded by:{" "}
                <strong>{v.user?.username || "anonymous"}</strong>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className={`status-pill status-${v.status}`}>
                {v.status}
              </span>
              {v._processingProgress !== undefined && v.status !== "done" && (
                <div className="mini-progress">
                  <div
                    className="mini-fill"
                    style={{ width: `${v._processingProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
          {v.status === "done" && <VideoPlayer video={v} />}
          {v.status === "processing" && (
            <div className="muted">
              Processing... sensitivity: {v.sensitivity || "pending"}
            </div>
          )}

          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            {currentUser &&
              (currentUser.role === "admin" ||
                String(currentUser.id) === String(v.user?._id || v.user)) && (
                <button className="btn" onClick={() => handleDelete(v._id)}>
                  Delete
                </button>
              )}
            {currentUser && ["admin", "editor"].includes(currentUser.role) && (
              <>
                <button
                  className="btn"
                  onClick={() => overrideSensitivity(v._id, "safe")}
                >
                  Mark Safe
                </button>
                <button
                  className="btn"
                  onClick={() => overrideSensitivity(v._id, "flagged")}
                >
                  Mark Flagged
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
