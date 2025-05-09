"use client";

import React from "react";

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
    <section className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-10">🌟 Vibes of the Month</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {mockVibes.map((vibe) => (
            <div
              key={vibe.id}
              className="bg-zinc-900 rounded-2xl shadow-lg p-4 hover:scale-105 transition-transform"
            >
              <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                <img
                  src={vibe.image}
                  alt={vibe.phrase}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xl font-semibold mb-2">&quot;{vibe.phrase}&quot;</p>
              <p className="text-sm text-gray-400">{vibe.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
