/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    workerThreads: true,
    cpus: 10
  }
}

module.exports = nextConfig
