"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnected(true);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black text-white shadow-md">
      {/* Лого */}
      <div className="flex items-center gap-2">
        <Link href="/" className="text-2xl font-bold">
          ✨ Proof of Vibe
        </Link>
      </div>

      {/* Навігація */}
      <div className="flex items-center gap-6">
        <Link href="/trending" className="hover:text-gray-400 transition">
          Вайби місяця
        </Link>

        {connected && (
          <>
            <Link href="/create" className="hover:text-gray-400 transition">
              Створити вайб
            </Link>
            <Link href="/my-vibes" className="hover:text-gray-400 transition">
              Мої вайби
            </Link>
          </>
        )}

        {!connected ? (
          <button
            onClick={handleConnect}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Підключити гаманець
          </button>
        ) : (
          <button
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition"
            disabled
          >
            ✅ Підключено
          </button>
        )}
      </div>
    </nav>
  );
}
