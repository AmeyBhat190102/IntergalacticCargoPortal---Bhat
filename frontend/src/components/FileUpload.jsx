import { useRef, useState } from "react";
import client from "../api/client";

export default function FileUpload({ onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("loading");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await client.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { saved, skipped_prime } = res.data;
      setStatus("success");
      setMessage(
        `${saved} record${saved !== 1 ? "s" : ""} saved. ` +
          `${skipped_prime.length} skipped (prime weight): ${
            skipped_prime.length ? skipped_prime.join(", ") : "none"
          }.`,
      );
      onUploadSuccess?.();
    } catch (err) {
      setStatus("error");
      setMessage(
        err.response?.data?.detail || "Upload failed. Check file format.",
      );
    } finally {
      // Reset input so same file can be re-uploaded
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <label
          htmlFor="manifest-upload"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600
                     text-space-950 font-ui font-bold text-sm uppercase tracking-widest
                     px-5 py-2.5 rounded cursor-pointer transition-colors duration-200"
        >
          <UploadIcon />
          {status === "loading" ? "Uploading..." : "Upload Manifest"}
        </label>
        <input
          id="manifest-upload"
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleUpload}
          className="hidden"
          disabled={status === "loading"}
        />
        <span className="text-slate-500 font-mono text-xs">
          .txt files only
        </span>
      </div>

      {status === "success" && (
        <p className="text-green-400 font-mono text-xs bg-green-950 border border-green-800 px-3 py-2 rounded">
          ✓ {message}
        </p>
      )}
      {status === "error" && (
        <p className="text-red-400 font-mono text-xs bg-red-950 border border-red-800 px-3 py-2 rounded">
          ✗ {message}
        </p>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
