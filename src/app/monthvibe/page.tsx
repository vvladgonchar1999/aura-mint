"use client";

import React from "react";
import Image from 'next/image';
import styles from "./page.module.css";

const mockVibes = [
  {
    id: 1,
    phrase: "Together we rise",
    author: "@sunnyViber",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxtgWq1avszGJli33oIKDkKs5f7XyJkT_zwA&s",
  },
  {
    id: 2,
    phrase: "Peace over pressure",
    author: "@chillwave",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQGP9LXRBtaFMORhvICbr7rIR0vjfGyc-egA&s",
  },
  {
    id: 3,
    phrase: "Energy never lies",
    author: "@truthseeker",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da847391f2e211f1ce5271d2e9f8",
  },
  {
    id: 4,
    phrase: "Vibe is the new currency",
    author: "@vibenaut",
    image: "https://i.pinimg.com/236x/a6/67/d7/a667d74784a6288893383a840f022b8c.jpg",
  },
];

export default function VibesOfTheMonth() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>🌟 Vibes of the Month</h2>
        <div className={styles.grid}>
          {mockVibes.map((vibe) => (
            <div
              key={vibe.id}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={vibe.image}
                  alt={vibe.phrase}
                  width={500}  
                  height={300}         
                  className={styles.image}
                />
              </div>
              <p className={styles.nftPhrase}>&quot;{vibe.phrase}&quot;</p>
              <p className={styles.nftAuthor}>{vibe.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
