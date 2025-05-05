import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";

const COLLECTION_TAG = "vibe-collection";

export async function getOrCreateUserCollection(wallet: any): Promise<PublicKey> {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

  const existingNfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });
  const collection = existingNfts.find((nft) => nft.name.includes(COLLECTION_TAG) && nft.collectionDetails);

  if (collection) return collection.address;

  const { nft } = await metaplex.nfts().create({
    name: `${COLLECTION_TAG}-${wallet.publicKey.toBase58().slice(0, 4)}`,
    symbol: "VIBE",
    uri: "https://arweave.net/some-placeholder-json", 
    sellerFeeBasisPoints: 0,
    isCollection: true,
  });

  return nft.address;
}
