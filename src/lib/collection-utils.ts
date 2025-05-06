import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const COLLECTION_TAG = "vibe-collection";

// export async function getOrCreateUserCollection(wallet: any): Promise<PublicKey> {
//   const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
//   const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

//   const existingNfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });
//   const collection = existingNfts.find((nft) => nft.name.includes(COLLECTION_TAG) && nft.collectionDetails);

//   if (collection) return collection.address;

//   const { nft } = await metaplex.nfts().create({
//     name: `${COLLECTION_TAG}-${wallet.publicKey.toBase58().slice(0, 4)}`,
//     symbol: "VIBE",
//     uri: "https://arweave.net/some-placeholder-json", 
//     sellerFeeBasisPoints: 0,
//     isCollection: true,
//   });

//   return nft.address;
// }


// export function useUserCollection(metaplex: Metaplex) {
//     const { publicKey } = useWallet();
//     const [collectionMint, setCollectionMint] = useState<PublicKey | null>(null);
//     const [loading, setLoading] = useState(false);
  
    
//     useEffect(() => {
//       if (!publicKey) return;
  
//       const fetchCollection = async () => {
//         setLoading(true);
//         try {
//           const allNfts = await metaplex.nfts().findAllByOwner({ owner: publicKey }).run();
//           const collection = allNfts.find((nft) => nft.collectionDetails?.__kind === "V1");
  
//           if (collection?.collection?.verified && collection.collection.address) {
//             setCollectionMint(collection.collection.address);
//           } else {
//             setCollectionMint(null);
//           }
//         } catch (e) {
//           console.error("Error fetching collection:", e);
//           setCollectionMint(null);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchCollection();
//     }, [publicKey?.toBase58()]);
  
//     return { collectionMint, loading };
//   }