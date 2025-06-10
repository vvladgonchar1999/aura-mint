'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface NFT {
  id: number;
  nft_address: string;
  author_address: string;
  name: string;
  message: string;
  created_at: string;
}

export default function NFTList() {
  const wallet = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await fetch('/api/nfts/list');
        const data = await response.json();
        if (response.ok) {
          setNfts(data);
        } else {
          throw new Error(data.error || 'Failed to fetch NFTs');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-purple-400">My Minted NFTs</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : nfts.length === 0 ? (
        <p className="text-gray-400">No NFTs found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <div key={nft.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">{nft.name}</h3>
              <p className="text-gray-300 mb-4">{nft.message}</p>
              <div className="text-sm text-gray-400">
                <p>NFT Address: {nft.nft_address.slice(0, 6)}...{nft.nft_address.slice(-4)}</p>
                <p>Author: {nft.author_address.slice(0, 6)}...{nft.author_address.slice(-4)}</p>
                <p>Created: {new Date(nft.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}