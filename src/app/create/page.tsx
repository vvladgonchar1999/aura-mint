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

    setLoading(true);
    setStatus("Minting and sending NFT...");

    stopCamera();
    setPhoto(null);
    setMode(null);

    try {
      const mint = await mintAndSendVibeNFT(wallet, nftName, message, photo);
      
      
      const saveResponse = await fetch('/api/nfts/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nftAddress: mint,
          authorAddress: wallet.publicKey.toBase58(),
          nftName,
          message
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save vibe');
      }

      setStatus(`NFT minted and saved successfully! Mint Address: ${mint}`);
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
  <div className="relative min-h-screen bg-gray-900">
    {showCollectionPrompt && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 text-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-xl mx-auto relative">
          <button
            onClick={handleCloseCollectionPrompt}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-100 cursor-pointer p-2"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <CreateCollectionPrompt onCollectionCreated={handleCollectionCreated} />
        </div>
      </div>
    )}

    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="bg-gray-900 shadow-lg rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-xl mx-auto text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-purple-400">
          Create a Vibe NFT <span className="text-yellow-400">✨</span>
        </h1>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="nftName" className="block text-gray-300 text-sm font-bold mb-2">
              NFT Name
            </label>
            <input
              type="text"
              id="nftName"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
              placeholder="Your Vibe name..."
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="vibeMessage" className="block text-gray-300 text-sm font-bold mb-2">
              Vibe Message
            </label>
            <textarea
              id="vibeMessage"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
              rows={3}
              placeholder="Enter your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={startCamera}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center flex-1"
            >
              <FiCamera className="mr-2" />
              Open Camera
            </button>

            <label className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer flex items-center justify-center flex-1">
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
            <div className="border rounded-md p-3 bg-gray-800">
              <video 
                ref={videoRef} 
                className="w-full h-auto max-h-64 rounded-md mb-3" 
                autoPlay 
                playsInline
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <button
                onClick={takePhoto}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Take Photo
              </button>
            </div>
          )}

          {photo && (
            <div className="border rounded-md p-3 bg-gray-800">
              <p className="mb-2 text-gray-300">
                <span className="text-green-400 mr-1">📸</span> Preview:
              </p>
              <div className="relative w-full aspect-square">
                <Image
                  src={URL.createObjectURL(photo)}
                  alt="Preview"
                  fill
                  className="rounded-md object-cover"
                  unoptimized={true}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleMint}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : "Mint NFT"}
          </button>

          {status && (
            <div className="mt-4 p-3 bg-gray-800 rounded-md">
              <p className="text-gray-300">{status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}