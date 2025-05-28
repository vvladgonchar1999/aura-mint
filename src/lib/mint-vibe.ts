import { WalletContextState } from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, } from "@solana/web3.js";


export async function mintAndSendVibeNFT(
  wallet: WalletContextState,
  name: string,
  message: string,  
  photo: Blob,
  //collectionAddress?:string
): Promise<string> {
  if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected or incomplete");
  }

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

  
  const file = new File([photo], "vibe-photo.png", { type: "image/png" });

  
  const imageUrl = await uploadToPinata(file, "vibe-photo.png");

  
 
  const metadata = {
    name: name, 
    symbol: "VIBE",
    description: message,
    image: imageUrl,
    properties: {
      files: [{ uri: imageUrl, type: "image/png" }],
      category: "image",
    },
  };

  const metadataUri = await uploadToPinata(
    new Blob([JSON.stringify(metadata)], { type: "application/json" }),
    "metadata.json"
  );

  //const collection = new PublicKey(collectionAddress!)

  const { nft } = await metaplex.nfts().create({
    uri: metadataUri,
    name: name,
    symbol: "VIBE",
    sellerFeeBasisPoints: 0,    
    tokenOwner: wallet.publicKey,
    //collection,
  });

  // if (collection) {
  //   try {
  //     await metaplex.nfts().verifyCollection({
  //       mintAddress: nft.address,
  //       collectionMintAddress: new PublicKey(collectionAddress!),
  //       isSizedCollection: true,
  //     });
  //   } catch (error) {
  //     console.warn("Collection verification failed:", error);
  //   }
  // }

  // Store vibe data in MongoDB
  try {
    const response = await fetch('/api/vibes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creatorAddress: wallet.publicKey.toBase58(),
        mintAddress: nft.address.toBase58(),
      }),
    });

    if (!response.ok) {
      console.error('Failed to store vibe data:', await response.text());
    }
  } catch (error) {
    console.error('Error storing vibe data:', error);
  }

  return nft.address.toBase58();
}


export async function uploadToPinata(file: Blob | File, filename: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file, filename);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload to Pinata");
  }

  const data = await res.json();
  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
}


export async function createUserCollection(
  wallet: WalletContextState,
  name: string = "My Vibe Collection"
): Promise<string> {
  if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected or incomplete");
  }

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

  const { nft } = await metaplex.nfts().create({
    uri: "https://arweave.net/placeholder-metadata",
    name,
    symbol: "VIBE",
    sellerFeeBasisPoints: 0,
    isCollection: true,    
  });

  return nft.address.toBase58();
}