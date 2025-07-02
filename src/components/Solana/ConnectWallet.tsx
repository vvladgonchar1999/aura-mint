'use client';

import dynamic from 'next/dynamic';


const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { 
    ssr: false,
    loading: () => (
      <button className="wallet-adapter-button wallet-adapter-button-trigger">
        Loading...
      </button>
    )
  }
);

const ConnectWallet = () => {
  return <WalletMultiButtonDynamic />;
};

export default ConnectWallet;