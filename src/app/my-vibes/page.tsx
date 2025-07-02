"use client"

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import Image from 'next/image';
import styles from "./page.module.css";

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
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>🌈 My Vibes</h2>

        {!wallet.connected ? (
          <p className={styles.infoText}>Please connect your wallet to view your vibe NFTs.</p>
        ) : loading ? (
          <p className={styles.infoText}>Loading your vibes...</p>
        ) : vibes.length === 0 ? (
          <p className={styles.infoText}>No VIBE NFTs found in your wallet.</p>
        ) : (
          <div className={styles.grid}>
            {vibes.map((vibe) => (
              <div
                key={vibe.mint}
                className={styles.card}
              >
                <Image
                  src={vibe.image}
                  alt={vibe.name}
                  width={500}  
                  height={300} 
                  className={styles.image}
                />
                <p className={styles.nftName}>{vibe.name}</p>
                <p className={styles.nftMint}>{vibe.mint}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
