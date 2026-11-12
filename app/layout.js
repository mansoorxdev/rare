import './globals.css';
import PrivyClientProvider from '../components/PrivyClientProvider';

export const metadata = {
  title: 'RARE // 10,078 Autonomous Solana Agents',
  description: '10,078 autonomous agents on Solana, each an NFT with its own token-bound wallet. 90% of every mint goes into the agent\'s own wallet.',
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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect x='2' y='2' width='28' height='22' fill='%23141416'/><rect x='5' y='5' width='22' height='16' fill='%2300ff66'/><rect x='10' y='25' width='12' height='4' fill='%23141416'/></svg>" />
      </head>
      <body>
        <PrivyClientProvider>
          {children}
        </PrivyClientProvider>
      </body>
    </html>
  );
}
