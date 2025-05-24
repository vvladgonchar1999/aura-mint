"use client";

import { useEffect, useState } from "react";
import { Metadata, Metaplex } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import Image from 'next/image';

interface VibeNFT {
  name: string;
  image: string;
  mint: string;
  voted: boolean;
}

export default function VibeVotePage() {
  const [nfts, setNfts] = useState<VibeNFT[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const connection = new Connection(clusterApiUrl("devnet"));
        const metaplex = new Metaplex(connection);

        const knownMints = [
          "Fg6PaFpoGXkYsidMpWxqSWzkQ2PKkF5Z4tZ5V1ADt7Be",
        ];

        const metadataList = await metaplex.nfts().findAllByMintList({
          mints: knownMints.map((m) => new PublicKey(m)),
        });

        const validMetadata = metadataList.filter(
          (nft): nft is Metadata => nft !== null && nft.model === 'metadata'
        );

        const vibeNFTs: VibeNFT[] = [];

        for (const metadata of validMetadata) {
          if (!metadata) continue;
          const nft = await metaplex.nfts().load({ metadata });

          if (nft.symbol === "VIBE") {
            
            type NFTAttribute = {
              trait_type: string;
              value: string | number;
            };

            const createdAt = (nft.json?.attributes as NFTAttribute[] | undefined)?.find(
              (a: NFTAttribute) => a.trait_type === "createdAt"
            )?.value;

            const createdTime = createdAt ? new Date(String(createdAt)).getTime() : 0;
            const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

            if (createdTime > oneMonthAgo) {
              vibeNFTs.push({
                name: nft.name,
                image: nft.json?.image || "",
                mint: nft.address.toBase58(),
                voted: localStorage.getItem(`voted-${nft.address.toBase58()}`) === "true",
              });
            }
          }
        }

        setNfts(vibeNFTs);
      } catch (e: unknown) {
        const error = e instanceof Error ? e.message : 'Get vibe failed';
        console.error("Failed to fetch NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const handleVote = (mint: string) => {
    localStorage.setItem(`voted-${mint}`, "true");
    setNfts((prev) =>
      prev.map((n) => (n.mint === mint ? { ...n, voted: true } : n))
    );
  };

  return (
    <section className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8">🔥 Vibes of the Month</h2>

        {loading ? (
          <p>Loading vibes...</p>
        ) : nfts.length === 0 ? (
          <p>No vibes found for this month.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {nfts.map((nft) => (
              <div key={nft.mint} className="bg-zinc-900 p-4 rounded-xl shadow hover:scale-105 transition">
                <Image
                  src={nft.image}
                  alt={nft.name}
                  className="rounded-lg w-full h-60 object-cover mb-4"
                />
                <p className="text-lg font-semibold">{nft.name}</p>
                <p className="text-xs text-gray-500 truncate mb-2">{nft.mint}</p>
                <button
                  onClick={() => handleVote(nft.mint)}
                  disabled={nft.voted}
                  className={`w-full mt-2 py-2 rounded font-bold transition ${nft.voted ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {nft.voted ? "✅ Voted" : "Vote"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
