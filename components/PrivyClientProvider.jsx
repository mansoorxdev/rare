'use client';

import React from 'react';
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';

export { usePrivy };

export default function PrivyClientProvider({ children }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmw90bwo201n70hl6iypzhzg8';

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#00ff66',
          logo: 'https://rare-puce.vercel.app/rare-logo-icon.png',
          showWalletLoginFirst: true,
          walletList: ['phantom', 'solflare', 'backpack', 'coinbase_wallet']
        },
        loginMethods: ['wallet', 'email', 'google', 'twitter'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          noPromptOnSignature: false
        }
      }}
    >
      {children}
    </PrivyProvider>
  );
}
