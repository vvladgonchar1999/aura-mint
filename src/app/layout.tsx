import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { SolanaConnection } from "@/components/Solana/SolanaConnection";
export const metadata: Metadata = {
  title: "Proof of Vibe",
  description: "A unique NFT collection capturing the mood, energy, and vibe of an event, group chat, or moment. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SolanaConnection>
         <Navbar />
        {children}
        </SolanaConnection>
      </body>
    </html>
  );
}
