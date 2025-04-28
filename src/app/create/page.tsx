"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintVibeNFT } from "@/lib/mint-vibe";

export default function CreatePage() {
  const [vibe, setVibe] = useState("");
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const wallet = useWallet();

  const handleMint = async () => {
    if (!vibe.trim()) {
      alert("Please enter a vibe phrase!");
      return;
    }

    if (!wallet.connected) {
      alert("Please connect your wallet!");
      return;
    }

    try {
      setLoading(true);
      const signature = await mintVibeNFT(wallet, vibe);
      setTxSignature(signature);
      setVibe("");
    } catch (error) {
      console.error("Minting error:", error);
      alert("Failed to mint Vibe NFT.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center">Create Your Vibe ✨</h1>

      <input
        type="text"
        placeholder="Enter your vibe phrase..."
        className="w-full max-w-md px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 mb-4 focus:outline-none"
        value={vibe}
        onChange={(e) => setVibe(e.target.value)}
      />

      <button
        onClick={handleMint}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Minting..." : "Mint Vibe NFT"}
      </button>

      {txSignature && (
        <p className="mt-6 text-green-400">
          Minted!{" "}
          <a
            href={`https://explorer.solana.com/address/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on Solana Explorer
          </a>
        </p>
      )}
    </main>
  );
}
