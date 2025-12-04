import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const API = import.meta.env.VITE_API_URL || "http://localhost:4001";
const SOCKET = io(API);

export default function Upload({ currentUser }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [videoId, setVideoId] = useState(null);
  const [visibility, setVisibility] = useState("public");

  useEffect(() => {
    const handler = (d) => {
      if (!d) return;
      if (d.videoId && videoId && d.videoId === videoId) {
        if (d.progress !== undefined) setProcessingProgress(d.progress);
      }
    };
    SOCKET.on("processing", handler);
    return () => {
      SOCKET.off("processing", handler);
    };
  }, [videoId]);

  const handle = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please pick a video file to upload.");
    if (!currentUser) return alert("Please login to upload videos.");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("visibility", visibility);
    try {
      setUploading(true);
      setUploadProgress(0);
      setProcessingProgress(0);
      const res = await axios.post(API + "/api/videos/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          const p = Math.round((ev.loaded / ev.total) * 100);
          setUploadProgress(p);
        },
      });
      const v = res.data.video;
      setVideoId(v._id);
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed. See console for details.");
    } finally {
      setUploading(false);
    }
  };

  const combinedProgress = Math.round(
    Math.min(100, uploadProgress * 0.6 + processingProgress * 0.4)
  );

  return (
    <div className="upload-card">
      <h2>Upload Video</h2>
      <form onSubmit={handle} className="upload-form">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          style={{ padding: 6, borderRadius: 6 }}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <button disabled={uploading} className="btn">
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <div className="progress-block">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${combinedProgress}%` }}
          />
        </div>
        <div className="progress-labels">
          <small>Upload: {uploadProgress}%</small>
          <small>Processing: {processingProgress}%</small>
          <strong>Overall: {combinedProgress}%</strong>
        </div>
      </div>

      {videoId && <div className="note">Processing video ID: {videoId}</div>}
    </div>
  );
}
