"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
//import { createCollectionIfMissing } from "@/lib/collection-utils";
import { FiUploadCloud } from "react-icons/fi";

interface Props {
  onCollectionCreated: () => void;
}

export default function CreateCollectionPrompt({ onCollectionCreated }: Props) {
  const wallet = useWallet();
  const [collectionName, setCollectionName] = useState("My Vibes Collection");
  const [description, setDescription] = useState("A personal collection of good vibes");
  const [image, setImage] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCreate = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!image) {
      alert("Please upload an image for your collection.");
      return;
    }

    setLoading(true);
    setStatus("Creating collection...");

    try {
      //await createCollectionIfMissing(wallet, collectionName, description, image);
      setStatus("Collection created successfully!");
      onCollectionCreated();
    } catch (err) {
      console.error(err);
      setStatus("Failed to create collection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Create Your Vibe Collection ✨</h2>
      <p className="mb-4 text-gray-300">
        To get started, create your personal NFT collection. Upload a cover image and confirm to mint your first Vibe!
      </p>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">Collection Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">Description</label>
        <textarea
          rows={3}
          className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">Collection Image</label>
        <label className="flex items-center bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded cursor-pointer">
          <FiUploadCloud className="mr-2" /> Upload Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
        {image && <p className="mt-2 text-green-400">✅ Image uploaded</p>}
      </div>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? "Creating..." : "Create Collection"}
      </button>

      {status && <p className="mt-4 text-sm text-center">{status}</p>}
    </div>
  );
}
