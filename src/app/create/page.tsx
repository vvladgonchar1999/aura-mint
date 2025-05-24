"use client";

import { useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintAndSendVibeNFT } from "@/lib/mint-vibe";
import { FiCamera, FiUploadCloud } from "react-icons/fi";
//import { useUserCollection } from "@/lib/collection-utils";
import Image from 'next/image';
import CreateCollectionPrompt from "@/components/CreateCollectionPrompt/CreateCollectionPrompt";

export default function CreateVibeForm() {
  const wallet = useWallet();
  const [message, setMessage] = useState("");
  const [nftName, setNftName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [mode, setMode] = useState<"camera" | "upload" | null>(null);
  //const [collectionAddress, setCollectionAddress] = useState<string | null>(null);
  const [showCollectionPrompt, setShowCollectionPrompt] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  //const { collection, loading: collectionLoading } = useUserCollection(wallet.publicKey);

  // useEffect(() => {
  //   if (collection) {
  //     setCollectionAddress(collection.address.toBase58());
  //   }
  // }, [collection]);

  const handleCollectionCreated = () => {
    console.log("Collection created successfully!");
    setShowCollectionPrompt(false);
  };

  const handleCloseCollectionPrompt = () => {
    setShowCollectionPrompt(false);
  };

  const startCamera = async () => {
    setMode("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Failed to access camera.");
      setMode(null);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setMode(null);
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
      alert("Please fill in the name, message, and provide a photo.");
      return;
    }

    // if (!collectionAddress) {
    //   alert("Please create your NFT collection first.");
    //   return;
    // }

    setLoading(true);
    setStatus("Minting and sending NFT...");

    stopCamera();
    setPhoto(null);
    setMode(null);

    try {
      const mint = await mintAndSendVibeNFT(wallet, nftName, message, photo, ); //collectionAddress
      setStatus(`NFT minted successfully! Mint Address: ${mint}`);
    } catch (error) {
      console.error("Error minting and sending NFT:", error);
      setStatus(`Failed to mint NFT.`);
    } finally {
      setLoading(false);
    }
  };

  // if (collectionLoading || (!collection && !collectionAddress)) {
  //   return <CreateCollectionPrompt onCreated={setCollectionAddress} wallet={wallet} />;
  // }

  return (
    <div className="relative">
      {showCollectionPrompt && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md max-w-xl mx-auto relative">
            <button
              onClick={handleCloseCollectionPrompt}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-100 cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <CreateCollectionPrompt onCollectionCreated={handleCollectionCreated} />
          </div>
        </div>
      )}

      <div className="bg-gray-900 shadow-lg rounded-lg p-8 max-w-xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
          Create a Vibe NFT <span className="text-yellow-400">✨</span>
        </h1>

        <div className="mb-4">
          <label htmlFor="nftName" className="block text-gray-300 text-sm font-bold mb-2">
            NFT Name
          </label>
          <input
            type="text"
            id="nftName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
            placeholder="Your Vibe name..."
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="vibeMessage" className="block text-gray-300 text-sm font-bold mb-2">
            Vibe Message
          </label>
          <textarea
            id="vibeMessage"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
            rows={4}
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="mb-4 flex space-x-2">
          <button
            onClick={startCamera}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          >
            <FiCamera className="mr-2" />
            Open Camera
          </button>

          <label className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer flex items-center">
            <FiUploadCloud className="mr-2" />
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
          <div className="mb-4 border rounded-md p-3 bg-gray-800">
            <video ref={videoRef} className="w-full max-h-64 rounded-md mb-2" autoPlay />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <button
              onClick={takePhoto}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Take Photo
            </button>
          </div>
        )}

        {photo && (
          <div className="mb-4 border rounded-md p-3 bg-gray-800">
            <p className="mb-2 text-gray-300">
              <span className="text-green-400 mr-1">📸</span> Preview:
            </p>
            <Image
              src={URL.createObjectURL(photo)}
              alt="Preview"
              className="rounded-md w-full h-auto object-cover"
            />
          </div>
        )}

        <button
          onClick={handleMint}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={loading}
        >
          {loading ? "Processing..." : "Mint NFT"}
        </button>

        {status && (
          <p className="mt-6 text-lg">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
