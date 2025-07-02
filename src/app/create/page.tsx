"use client";

import { useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintAndSendVibeNFT } from "@/lib/mint-vibe";
import { FiCamera, FiUploadCloud } from "react-icons/fi";
//import { useUserCollection } from "@/lib/collection-utils";
import Image from 'next/image';
import CreateCollectionPrompt from "@/components/CreateCollectionPrompt/CreateCollectionPrompt";
import styles from "./page.module.css";

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
  <div className={styles.root}>
    {showCollectionPrompt && (
      <div className={styles.promptOverlay}>
        <div className={styles.promptBox}>
          <button
            onClick={handleCloseCollectionPrompt}
            className={styles.closeButton}
          >
            <svg className={styles.closeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <CreateCollectionPrompt onCollectionCreated={handleCollectionCreated} />
        </div>
      </div>
    )}

    <div className={styles.container}>
      <div className={styles.formBox}>
        <h1 className={styles.title}>
          Create a Vibe NFT <span className={styles.titleAccent}>✨</span>
        </h1>

        <div className={styles.formFields}>
          <div>
            <label htmlFor="nftName" className={styles.label}>
              NFT Name
            </label>
            <input
              type="text"
              id="nftName"
              className={styles.input}
              placeholder="Your Vibe name..."
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="vibeMessage" className={styles.label}>
              Vibe Message
            </label>
            <textarea
              id="vibeMessage"
              className={styles.input}
              rows={3}
              placeholder="Enter your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className={styles.photoButtons}>
            <button
              onClick={startCamera}
              className={styles.cameraButton}
            >
              <FiCamera className={styles.icon} />
              Open Camera
            </button>

            <label className={styles.uploadLabel}>
              <FiUploadCloud className={styles.icon} />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className={styles.uploadInput}
              />
            </label>
          </div>

          {mode === "camera" && (
            <div className={styles.cameraPreview}>
              <video 
                ref={videoRef} 
                className={styles.video} 
                autoPlay 
                playsInline
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <button
                onClick={takePhoto}
                className={styles.takePhotoButton}
              >
                Take Photo
              </button>
            </div>
          )}

          {photo && (
            <div className={styles.photoPreview}>
              <p className={styles.photoPreviewText}>
                <span className={styles.photoPreviewIcon}>📸</span> Preview:
              </p>
              <div className={styles.photoPreviewImageWrapper}>
                <Image
                  src={URL.createObjectURL(photo)}
                  alt="Preview"
                  fill
                  className={styles.photoPreviewImage}
                  unoptimized={true}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleMint}
            className={styles.mintButton}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.loadingSpinnerWrapper}>
                <svg className={styles.loadingSpinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className={styles.loadingSpinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className={styles.loadingSpinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : "Mint NFT"}
          </button>

          {status && (
            <div className={styles.statusBox}>
              <p className={styles.statusText}>{status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}