"use client";
import { useEffect, useState } from "react";

const fetchMockVibes = async () => {
  return [
    { mint: "FakeMint1", vibe: "Feeling cosmic ✨", appId: "proof-of-vibe" },
    { mint: "FakeMint2", vibe: "Just chilling 😎", appId: "proof-of-vibe" },
  ];
};

export default function Home() {
  const [vibe, setVibe] = useState("");
  const [userVibes, setUserVibes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [calendarVibes, setCalendarVibes] = useState<{ [date: string]: string }>({});
  const [selectedDate, setSelectedDate] = useState("");
 
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    if (walletConnected) {
      setLoading(true);
      fetchMockVibes()
        .then((nfts) => {
          const filtered = nfts.filter((nft) => nft.appId === "proof-of-vibe");
          setUserVibes(filtered);
        })
        .finally(() => setLoading(false));
    }
  }, [walletConnected]);

  const handleMint = () => {
    if (vibe.trim()) {
      alert(`Minting vibe: ${vibe}`);
      setUserVibes([...userVibes, { mint: "NewMockMint", vibe, appId: "proof-of-vibe" }]);
      setVibe("");
    }
  };

  const handleMoodSelect = (emoji: string) => {
    if (!selectedDate) return;
    setCalendarVibes({ ...calendarVibes, [selectedDate]: emoji });
  };

  return (
    <main className="p-6 max-w-4xl mx-auto bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-4 text-white">Proof of Vibe ✨</h1>
      <p className="mb-6 text-lg text-gray-400">
        Capture your mood, your moment. Mint the vibe.
      </p>
      
      <div className="mb-6">
        <button
          onClick={() => setWalletConnected(!walletConnected)}
          className={`px-4 py-2 rounded ${
            walletConnected
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {walletConnected ? "Disconnect Wallet" : "Connect Wallet (Mock)"}
        </button>
      </div>

      {walletConnected ? (
        loading ? (
          <p className="text-center text-gray-400">Loading your vibes...</p>
        ) : userVibes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {userVibes.map((v, i) => (
              <div
                key={i}
                className="rounded-xl shadow-md border border-gray-700 p-4 bg-gray-800"
              >
                <p className="text-lg text-white">"{v.vibe}"</p>
                <p className="text-sm text-gray-400 mt-1">Mint: {v.mint}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mb-12">
            <p className="mb-4 text-gray-400">
              No Proof of Vibe NFTs found in your wallet.
            </p>
            <div className="flex gap-2 justify-center">
              <input
                type="text"
                placeholder="Type your vibe..."
                className="border border-gray-700 bg-gray-800 text-white rounded px-3 py-2"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
              />
              <button
                onClick={handleMint}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Mint
              </button>
            </div>
          </div>
        )
      ) : (
        <p className="text-center text-gray-400">
          Connect your wallet to view or mint vibes.
        </p>
      )}
      
      
    </main>
  );
}
