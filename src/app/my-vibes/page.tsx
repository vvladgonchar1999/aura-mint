"use client"

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

type VibeNFT = {
  name: string;
  image: string;
  mint: string;
};

export default function MyVibesPage() {
  const wallet = useWallet();
  const [vibes, setVibes] = useState<VibeNFT[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!wallet.connected || !wallet.publicKey) return;

    const fetchVibes = async () => {
      setLoading(true);
      try {
        const connection = new Connection(clusterApiUrl("devnet"));
        const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));
        const allNFTs = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey! });
        const vibeNFTs: VibeNFT[] = [];

        for (const nft of allNFTs || []) {
          if (nft.symbol !== "VIBE") continue;

          try {
            const metadataRes = await fetch(nft.uri);
            const metadata = await metadataRes.json();
            vibeNFTs.push({
              name: nft.name || "Vibe NFT",
              image: metadata.image || "",
              mint: nft.address.toBase58(),
            });
          } catch (e) {
            console.warn(`Failed to fetch metadata for ${nft.name}`, e);
          }
        }

        setVibes(vibeNFTs);


        setVibes(vibeNFTs);
      } catch (err) {
        console.error("Error loading NFTs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVibes();
  }, [wallet]);

  return (
    <section className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8">🌈 My Vibes</h2>

        {!wallet.connected ? (
          <p className="text-gray-400">Please connect your wallet to view your vibe NFTs.</p>
        ) : loading ? (
          <p className="text-gray-400">Loading your vibes...</p>
        ) : vibes.length === 0 ? (
          <p className="text-gray-400">No VIBE NFTs found in your wallet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {vibes.map((vibe) => (
              <div
                key={vibe.mint}
                className="bg-zinc-900 rounded-xl p-4 shadow-lg hover:scale-105 transition"
              >
                <img
                  src={vibe.image}
                  alt={vibe.name}
                  className="rounded-lg w-full h-60 object-cover mb-4"
                />
                <p className="text-lg font-semibold">{vibe.name}</p>
                <p className="text-sm text-gray-500 truncate">{vibe.mint}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
