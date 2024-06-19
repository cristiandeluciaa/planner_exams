/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    JWT_KEY: process.env.JWT_KEY, 
  },
};

export default nextConfig;
