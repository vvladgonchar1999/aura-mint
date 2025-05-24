"use client";

import React from "react";
import Image from 'next/image';

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
    <section className="bg-black text-white py-8 sm:py-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-10">🌟 Vibes of the Month</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {mockVibes.map((vibe) => (
            <div
              key={vibe.id}
              className="bg-zinc-900 rounded-2xl shadow-lg p-4 hover:scale-105 transition-transform duration-200"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
                <Image
                  src={vibe.image}
                  alt={vibe.phrase}  
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-lg sm:text-xl font-semibold mb-2">&quot;{vibe.phrase}&quot;</p>
              <p className="text-sm text-gray-400">{vibe.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
