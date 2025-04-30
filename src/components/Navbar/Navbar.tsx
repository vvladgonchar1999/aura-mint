"use client";

import Link from "next/link";
import ConnectWallet from "@/components/Solana/ConnectWallet";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Navbar() {
    const { connected } = useWallet();

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-black text-white shadow-md">

            <div className="flex items-center gap-2">
                <Link href="/" className="text-2xl font-bold">
                    Aura Mint
                </Link>
            </div>


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

                <ConnectWallet />

            </div>
        </nav>
    );
}
