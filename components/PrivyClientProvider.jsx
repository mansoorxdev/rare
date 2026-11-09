'use client';

import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

export { usePrivy } from '@privy-io/react-auth';

export default function PrivyClientProvider({ children }) {
  const envAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  // Privy requires a valid 25-character App ID from dashboard.privy.io (e.g. clw... or cm1...)
  const appId = (envAppId && envAppId.length === 25)
    ? envAppId
    : 'clw1234567890123456789012';

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#00e65b',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
          showWalletLoginFirst: true,
          walletChainType: 'ethereum-and-solana',
          walletList: [
            'phantom',
            'solflare',
            'backpack',
            'detected_wallets',
            'coinbase_wallet',
            'metamask',
            'wallet_connect'
          ],
        },
        loginMethods: ['wallet', 'email', 'google', 'twitter'],
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
