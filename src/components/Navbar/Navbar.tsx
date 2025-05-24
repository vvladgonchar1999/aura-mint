"use client";

import Link from "next/link";
import ConnectWallet from "@/components/Solana/ConnectWallet";
import { useWallet } from "@solana/wallet-adapter-react";
import { Home, Calendar, PlusCircle, User} from "lucide-react";

export default function Navbar() {
    const { connected } = useWallet();

    return (
        <>           
            <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-black text-white shadow-md">
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-2xl font-bold">
                        Aura Mint
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/monthvibe" className="hover:text-gray-400 transition">
                        Vibe of the month
                    </Link>

                    {connected && (
                        <>
                            <Link href="/create" className="hover:text-gray-400 transition">
                                Create vibe
                            </Link>
                            <Link href="/my-vibes" className="hover:text-gray-400 transition">
                                My vibe
                            </Link>
                        </>
                    )}

                    <ConnectWallet />
                </div>
            </nav>

            
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
                <div className="flex items-center justify-around px-2 py-3">
                    <Link 
                        href="/" 
                        className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <Home size={24} />
                        <span className="text-xs mt-1">Home</span>
                    </Link>

                    <Link 
                        href="/monthvibe" 
                        className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <Calendar size={24} />
                        <span className="text-xs mt-1">Month</span>
                    </Link>

                    {connected && (
                        <>
                            <Link 
                                href="/create" 
                                className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
                            >
                                <PlusCircle size={24} />
                                <span className="text-xs mt-1">Create</span>
                            </Link>

                            <Link 
                                href="/my-vibes" 
                                className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
                            >
                                <User size={24} />
                                <span className="text-xs mt-1">My Vibes</span>
                            </Link>
                        </>
                    )}

                    
                        <div className="wallet-button-wrapper">
                            <ConnectWallet />
                        </div>                        
                    
                </div>
            </nav>          
            
        </>
    );
}
