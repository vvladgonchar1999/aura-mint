"use client"

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import Image from 'next/image';

type VibeNFT = {
  name: string;
  image: string;
  mint: string; 
};

export default function MyVibesPage() {
  const wallet = useWallet();
  const [vibes, setVibes] = useState<VibeNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState<VibeNFT | null>(null);

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
            
            const { uri } = nft;
            const metadataRes = await fetch(uri);
            if (!metadataRes.ok) throw new Error(`Failed to fetch metadata from ${uri}`);
            const metadata = await metadataRes.json();

            vibeNFTs.push({
              name: metadata.name || nft.name || "Vibe NFT", 
              image: metadata.image || nft.uri || "", 
              mint: nft.address.toBase58(),              
            });
          } catch (e) {
            console.warn(`Failed to fetch metadata for NFT with mint ${nft.address.toBase58()}:`, e);            
             vibeNFTs.push({
               name: nft.name || "Unnamed NFT",
               image: "", 
               mint: nft.address.toBase58(),
             });
          }
        }

        setVibes(vibeNFTs);
      } catch (err) {
        console.error("Error loading NFTs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVibes();
  }, [wallet]);

  const handleCardClick = (vibe: VibeNFT) => {
    setSelectedVibe(vibe);
  };

  const handleCloseModal = () => {
    setSelectedVibe(null);
  };

  return (
    <section className="bg-black text-white py-8 sm:py-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">🌈 My Vibes</h2>

        {!wallet.connected ? (
          <div className="bg-zinc-900 rounded-xl p-6 text-center">
            <p className="text-gray-400">Please connect your wallet to view your vibe NFTs.</p>
          </div>
        ) : loading ? (
          <div className="bg-zinc-900 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-400">Loading your vibes...</p>
            </div>
          </div>
        ) : vibes.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl p-6 text-center">
            <p className="text-gray-400">No VIBE NFTs found in your wallet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {vibes.map((vibe) => (
              <div
                key={vibe.mint}
                className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:opacity-80 transition transform duration-200"
                onClick={() => handleCardClick(vibe)}
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src={vibe.image || '/placeholder-image.png'} 
                    alt={vibe.name}
                    fill
                    className="object-cover"
                  />
                </div>                
              </div>
            ))}
          </div>
        )}
      </div>

      
      {selectedVibe && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4" onClick={handleCloseModal}>
          <div className="bg-zinc-900 rounded-xl shadow-lg p-6 max-w-sm md:max-w-md lg:max-w-sm w-full text-white overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}> {/* Prevent click from closing modal */}
            <div className="relative w-full aspect-square mb-4">
              <Image
                src={selectedVibe.image || '/placeholder-image.png'}
                alt={selectedVibe.name}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 break-words">{selectedVibe.name}</h3>           
            <p className="text-sm text-gray-500 break-all">Mint: {selectedVibe.mint}</p>
            <button
              onClick={handleCloseModal}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
