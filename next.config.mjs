/** @type {import('next').NextConfig} */
const optionalModules = [
  '@farcaster/mini-app-solana',
  '@farcaster/mini-app-sdk',
  '@abstract-foundation/agw-client',
  'permissionless',
  '@stripe/stripe-js',
  '@solana/kit',
  '@solana-program/system',
  '@solana-program/memo',
  '@solana-program/token',
];

const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...Object.fromEntries(optionalModules.map((m) => [m, false])),
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      ...Object.fromEntries(optionalModules.map((m) => [m, false])),
    };

    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
        ...optionalModules,
      ];
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/nfts/:id*',
        destination: '/api/nft/:id*',
      },
    ];
  },
};

export default nextConfig;
