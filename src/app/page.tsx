"use client";
import { useEffect, useState } from "react";

const fetchMockVibes = async () => {
  return [
    { mint: "FakeMint1", vibe: "Feeling cosmic ✨", appId: "proof-of-vibe" },
    { mint: "FakeMint2", vibe: "Just chilling 😎", appId: "proof-of-vibe" },
  ];
};

type Mood = {
  emoji: string;
  label: string;
};


const moods: Mood[] = [
  { emoji: "🔥", label: "Productive" },
  { emoji: "😴", label: "Lazy" },
  { emoji: "😊", label: "Happy" },
  { emoji: "😔", label: "Low energy" },
  { emoji: "💡", label: "Inspired" },
  { emoji: "😡", label: "Frustrated" },
  { emoji: "✨", label: "In flow" },
];


const mockMintVibe = (date: string, mood: Mood) => {
  return {
    mint: `MockMint_${date}`,
    vibe: `${mood.emoji} ${mood.label}`,
    date,
    appId: "proof-of-vibe",
  };
};

export default function Home() {
  const [vibe, setVibe] = useState("");
  const [userVibes, setUserVibes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [vibes, setVibes] = useState<any[]>([]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();


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

  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const days = getDaysInMonth(currentYear, currentMonth);


  const handleMint = () => {
    if (selectedDate && selectedMood) {
      const minted = mockMintVibe(selectedDate, selectedMood);
      setVibes([...vibes, minted]);
      setSelectedMood(null);
      setSelectedDate(null);
    }
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
          className={`px-4 py-2 rounded ${walletConnected
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

      <p className="mb-6 text-lg text-gray-400">
        Select a day, choose your vibe, mint the mood.
      </p>

      <div className="grid grid-cols-7 gap-2 text-center mb-8">
        {days.map((day) => {
          const isoDate = day.toISOString().split("T")[0];
          const isSelected = selectedDate === isoDate;
          return (
            <button
              key={isoDate}
              onClick={() => setSelectedDate(isoDate)}
              className={`rounded-lg p-2 border ${isSelected ? "bg-purple-600 border-purple-400" : "bg-gray-800 border-gray-700"
                }`}
            >
              <div className="text-lg font-semibold">{day.getDate()}</div>
              <div className="text-xs text-gray-400">
                {vibes.find((v) => v.date === isoDate)?.vibe || ""}
              </div>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Select your vibe for {selectedDate}</h2>
          <div className="flex flex-wrap gap-4">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood)}
                className={`flex items-center gap-2 px-4 py-2 rounded border ${selectedMood?.label === mood.label
                  ? "bg-green-600 border-green-400"
                  : "bg-gray-800 border-gray-700"
                  }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="mt-6">
              <button
                onClick={handleMint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
              >
                Mint this vibe
              </button>
            </div>
          )}
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Your Vibes</h2>
      {vibes.length === 0 ? (
        <p className="text-gray-400">No vibes minted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vibes.map((v, i) => (
            <div key={i} className="rounded-xl shadow-md border border-gray-700 p-4 bg-gray-800">
              <p className="text-lg text-white">{v.vibe}</p>
              <p className="text-sm text-gray-400 mt-1">Date: {v.date}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
