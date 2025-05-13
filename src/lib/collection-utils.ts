import {
  Metaplex,
  keypairIdentity,
  walletAdapterIdentity,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { uploadToPinata } from "./mint-vibe";
const connection = new Connection(clusterApiUrl("devnet"));
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!;


async function uploadMetadataToPinata(metadata: object): Promise<string> {
  const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });

  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}

export async function createCollectionIfMissing(
  wallet: WalletContextState,
  name: string,
  description: string,
  image: Blob
): Promise<string> {
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
  
  const imageUri = await uploadToPinata(image, "collection-image.png");
  
  const metadata = {
    name,
    symbol: "VIBE",
    description,
    image: imageUri,
    properties: {
      creators: [{ address: wallet.publicKey!, share: 100 }],
      files: [{ uri: imageUri, type: "image/png" }],
    },
  };

  console.log(metadata)

  const metadataUri = await uploadMetadataToPinata(metadata);

  console.log(metadataUri)
  const { nft } = await metaplex.nfts().create({
    uri: metadataUri,
    name,
    symbol: "VIBE",
    sellerFeeBasisPoints: 0,
    isCollection: true,
  });
  
  console.log(nft)
  return nft.address.toBase58();
}
