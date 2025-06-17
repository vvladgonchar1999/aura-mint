"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';

interface Vibe {
  id: number;
  nft_address: string;
  author_address: string;
  name: string;
  message: string;
  created_at: string;
  votes?: number;
}

export default function VibeVotePage() {
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVibes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/nfts/list');
      if (!response.ok) throw new Error('Failed to fetch vibes');
      
      const data = await response.json();
      setVibes(data);
    } catch (error) {
      console.error('Error fetching vibes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVibes();
  }, []);

  const handleVote = async (nftAddress: string) => {
    try {      
      setVibes(prev => 
        prev.map(vibe => 
          vibe.nft_address === nftAddress 
            ? { ...vibe, votes: (vibe.votes || 0) + 1 }
            : vibe
        )
      );
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <section className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8">🔥 Vibes of the Month</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : vibes.length === 0 ? (
          <p className="text-center text-gray-400">No vibes found for this month.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {vibes.map((vibe) => (
              <div key={vibe.nft_address} className="bg-zinc-900 p-4 rounded-xl shadow hover:scale-105 transition">
                <div className="relative w-full aspect-square mb-4">
                  <Image
                    src={`https://arweave.net/${vibe.nft_address}`}
                    alt={vibe.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <p className="text-lg font-semibold">{vibe.name}</p>
                <p className="text-sm text-gray-400 mb-2">{vibe.message}</p>
                <p className="text-xs text-gray-500 truncate mb-2">Author: {vibe.author_address}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-400">Votes: {vibe.votes || 0}</span>
                  <button
                    onClick={() => handleVote(vibe.nft_address)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Vote
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
