/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/admin',
  reactStrictMode: true,
  output: 'standalone',
  publicRuntimeConfig: {
    basePath: '/admin',
  },
};

export default nextConfig;
