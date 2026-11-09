/** @type {import('next').NextConfig} */
const optionalModules = [
  '@solana/kit',
  '@solana-program/memo',
  '@solana-program/system',
  '@solana-program/token',
  '@stripe/stripe-js',
  '@farcaster/mini-app-solana',
  '@abstract-foundation/agw-client',
  'permissionless',
];

const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: false,
  webpack: (config, { isServer }) => {
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
      ...optionalModules.map((mod) => ({ [mod]: `commonjs ${mod}` })),
    ];

    config.resolve.fallback = {
      ...config.resolve.fallback,
      ...Object.fromEntries(optionalModules.map((mod) => [mod, false])),
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

export default nextConfig;
