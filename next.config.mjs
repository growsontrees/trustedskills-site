/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emits .next/standalone with only the files the server actually needs, so the
  // runtime image ships without the full node_modules tree.
  output: 'standalone',
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
