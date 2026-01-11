/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    DEPLOYMENT_TIMESTAMP: '2026-01-11T13:18:19.462Z',
    FORCE_REBUILD: 'true'
  },
  // Force rebuild with timestamp
  generateBuildId: async () => {
    return 'build-20260111131819462'
  }
}

module.exports = nextConfig