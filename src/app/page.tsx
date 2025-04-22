"use client"
import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";


const fetchUserNFTs = async (publicKey: string) => {
  return [
    { mint: "FakeMint1", vibe: "Feeling cosmic ✨", appId: "proof-of-vibe" },
    { mint: "FakeMint2", vibe: "Just chilling 😎", appId: "proof-of-vibe" },
  ];
};

export default function Home() {
  const [vibe, setVibe] = useState("");
  const [userVibes, setUserVibes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setLoading(true);
      fetchUserNFTs(wallet.publicKey.toBase58())
        .then((nfts) => {
          const filtered = nfts.filter((nft) => nft.appId === "proof-of-vibe");
          setUserVibes(filtered);
        })
        .finally(() => setLoading(false));
    }
  }, [wallet.connected, wallet.publicKey]);

  const handleMint = () => {
    if (vibe.trim()) {
      alert(`Minting vibe: ${vibe}`);
      setVibe("");
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Proof of Vibe ✨</h1>
      <p className="mb-6 text-lg text-gray-500">
        Capture your mood, your moment. Mint the vibe.
      </p>

      <div className="mb-6">
        <WalletMultiButton />
      </div>

      {wallet.connected ? (
        loading ? (
          <p className="text-center text-gray-500">Loading your vibes...</p>
        ) : userVibes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userVibes.map((v, i) => (
              <div
                key={i}
                className="rounded-xl shadow-md border p-4 bg-white"
              >
                <p className="text-lg">"{v.vibe}"</p>
                <p className="text-sm text-gray-500 mt-1">Mint: {v.mint}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              No Proof of Vibe NFTs found in your wallet.
            </p>
            <div className="flex gap-2 justify-center">
              <input
                type="text"
                placeholder="Type your vibe..."
                className="border rounded px-3 py-2"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
              />
              <button
                onClick={handleMint}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Mint
              </button>
            </div>
          </div>
        )
      ) : (
        <p className="text-center text-gray-500">
          Connect your wallet to view or mint vibes.
        </p>
      )}
    </main>
  );
}
