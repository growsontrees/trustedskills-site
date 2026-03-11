/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
