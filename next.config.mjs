/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
      {
        '@stripe/stripe-js': 'commonjs @stripe/stripe-js',
        '@solana/kit': 'commonjs @solana/kit',
        '@solana-program/system': 'commonjs @solana-program/system',
        '@solana-program/memo': 'commonjs @solana-program/memo',
        '@solana-program/token': 'commonjs @solana-program/token',
      },
    ];

    if (!isServer) {
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
};

export default nextConfig;
