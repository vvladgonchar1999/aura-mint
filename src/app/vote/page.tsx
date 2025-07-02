"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';
import styles from "./page.module.css";

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
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>🔥 Vibes of the Month</h2>

        {loading ? (
          <div className={styles.loaderWrapper}>
            <div className={styles.loader}></div>
          </div>
        ) : vibes.length === 0 ? (
          <p className={styles.emptyText}>No vibes found for this month.</p>
        ) : (
          <div className={styles.grid}>
            {vibes.map((vibe) => (
              <div key={vibe.nft_address} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={`https://arweave.net/${vibe.nft_address}`}
                    alt={vibe.name}
                    fill
                    className={styles.image}
                  />
                </div>
                <p className={styles.nftName}>{vibe.name}</p>
                <p className={styles.nftMessage}>{vibe.message}</p>
                <p className={styles.nftAuthor}>Author: {vibe.author_address}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.votes}>Votes: {vibe.votes || 0}</span>
                  <button
                    onClick={() => handleVote(vibe.nft_address)}
                    className={styles.voteButton}
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
