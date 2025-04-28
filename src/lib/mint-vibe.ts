import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export async function mintVibeNFT(wallet: WalletContextState, vibePhrase: string): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions || !wallet.wallet?.adapter) {
    throw new Error("Wallet not connected properly");
  }

  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet.wallet.adapter)); 

  const { nft } = await metaplex.nfts().create({
    uri: "https://arweave.net/your-fake-uri", // тимчасова ссилка  
    name: `Vibe: ${vibePhrase.substring(0, 20)}...`,
    sellerFeeBasisPoints: 0,
    symbol: "VIBE",
  });

  console.log("NFT created:", nft);

  return nft.address.toString();
}
