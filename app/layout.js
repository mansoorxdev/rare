import './globals.css';
import PrivyClientProvider from '../components/PrivyClientProvider';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rare.protocol'),
  title: 'RARE // 10,078 Autonomous Solana Agents',
  description: '10,078 autonomous agents on Solana, each an NFT with its own token-bound wallet. 90% of every mint goes into the agent\'s own wallet.',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-dark.png', sizes: '64x64', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png'
  },
  openGraph: {
    title: 'RARE PROTOCOL // 10,078 Autonomous Solana Agents',
    description: '10,078 autonomous agents on Solana. 90% Anchor CPI split into agent token-bound PDA vaults.',
    images: [{ url: '/RARE X BANNER.jpg', width: 1500, height: 500, alt: 'RARE Protocol' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RARE PROTOCOL // 10,078 Autonomous Solana Agents',
    description: '10,078 autonomous agents on Solana. 90% Anchor CPI split into agent token-bound PDA vaults.',
    images: ['/RARE X BANNER.jpg']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,500;0,600;0,700;1,700&family=Fragment+Mono:ital@0;1&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Silkscreen:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon-dark.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body>
        <PrivyClientProvider>
          {children}
        </PrivyClientProvider>
      </body>
    </html>
  );
}
