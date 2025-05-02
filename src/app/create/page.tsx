"use client";

import { useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintAndSendVibeNFT } from "@/lib/mint-vibe";

export default function CreateVibeForm() {
  const wallet = useWallet();
  const [message, setMessage] = useState("");
  const [nftName, setNftName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [mode, setMode] = useState<"camera" | "upload" | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setMode("camera");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const takePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) setPhoto(blob);
      }, "image/png");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setMode("upload");
    }
  };

  const handleMint = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!message || !photo || !nftName) {
      alert("Please fill in the name, message and provide a photo.");
      return;
    }

    setLoading(true);
    setStatus("Minting and sending NFT...");

    try {
      const mint = await mintAndSendVibeNFT(wallet, nftName, message, photo);
      setStatus(`✅ NFT minted! Mint Address: ${mint}`);
    } catch (error) {
      console.error("Error minting and sending NFT:", error);
      setStatus("❌ Failed to mint NFT.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Create a Vibe NFT ✨</h1>

      <label className="block mb-2">NFT Name</label>
      <input
        className="w-full p-3 rounded bg-gray-800 mb-4"
        type="text"
        placeholder="Vibe name..."
        value={nftName}
        onChange={(e) => setNftName(e.target.value)}
      />

      <label className="block mb-2">Vibe Message</label>
      <textarea
        className="w-full p-3 rounded bg-gray-800 mb-4"
        rows={4}
        placeholder="Type your vibe message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="mb-4">
        <button
          onClick={startCamera}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mr-2"
        >
          Open Camera
        </button>

        <label className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded cursor-pointer">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {mode === "camera" && (
        <div className="mb-4">
          <video ref={videoRef} className="w-full max-h-64 rounded mb-2" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <button
            onClick={takePhoto}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Take Photo
          </button>
        </div>
      )}

      {photo && (
        <div className="mb-4">
          <p className="mb-2">📸 Preview:</p>
          <img
            src={URL.createObjectURL(photo)}
            alt="Preview"
            className="rounded border"
          />
        </div>
      )}

      <button
        onClick={handleMint}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Mint NFT"}
      </button>

      {status && <p className="mt-6 text-lg text-green-400">{status}</p>}
    </div>
  );
}
