// "use client";

// import { useState } from "react";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { mintAndSendVibeNFT } from "@/lib/mint-vibe";

// export default function CreateVibeForm() {
//   const wallet = useWallet();
//   const [message, setMessage] = useState("");  
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleMint = async () => {
//     if (!wallet.connected || !wallet.publicKey) {
//       alert("Please connect your wallet first!");
//       return;
//     }

//     if (!message) {
//       alert("Please fill in both the message and the recipient wallet address.");
//       return;
//     }

//     setLoading(true);
//     setStatus("Minting and sending NFT...");

//     try {
//       const mint = await mintAndSendVibeNFT(wallet, message);
//       setStatus(`✅ NFT minted and sent! Mint Address: ${mint}`);
//     } catch (error: any) {
//       console.error("Error minting and sending NFT:", error);
//       setStatus("❌ Failed to mint and send NFT.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto py-10 px-4 text-white">
//       <h1 className="text-3xl font-bold mb-6">Send a Vibe NFT ✨</h1>

//       <label className="block mb-2">Vibe Message</label>
//       <textarea
//         className="w-full p-3 rounded bg-gray-800 mb-4"
//         rows={4}
//         placeholder="Type your vibe message..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />     

//       <button
//         onClick={handleMint}
//         className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
//         disabled={loading}
//       >
//         {loading ? "Processing..." : "Mint and Send NFT"}
//       </button>

//       {status && <p className="mt-6 text-lg text-green-400">{status}</p>}
//     </div>
//   );
// }

"use client";

import { useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintAndSendVibeNFT } from "@/lib/mint-vibe";

export default function CreateVibeForm() {
  const wallet = useWallet();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
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

  const handleMint = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!message || !photo) {
      alert("Please enter a message and take a photo.");
      return;
    }

    setLoading(true);
    setStatus("Minting and sending NFT...");

    try {
      const mint = await mintAndSendVibeNFT(wallet, message, photo);
      setStatus(`✅ NFT minted and sent! Mint Address: ${mint}`);
    } catch (error) {
      console.error("Error minting and sending NFT:", error);
      setStatus("❌ Failed to mint and send NFT.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Send a Vibe NFT ✨</h1>

      <label className="block mb-2">Vibe Message</label>
      <textarea
        className="w-full p-3 rounded bg-gray-800 mb-4"
        rows={4}
        placeholder="Type your vibe message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={startCamera}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded mb-2"
      >
        Open Camera
      </button>

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
        {loading ? "Processing..." : "Mint and Send NFT"}
      </button>

      {status && <p className="mt-6 text-lg text-green-400">{status}</p>}
    </div>
  );
}
