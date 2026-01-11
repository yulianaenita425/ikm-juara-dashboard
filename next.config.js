/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    DEPLOYMENT_TIMESTAMP: '2026-01-11T17:14:20.748Z',
    FORCE_REBUILD: 'true',
    MAIN_DOMAIN_DEPLOY: 'true'
  },
  // Force rebuild with timestamp
  generateBuildId: async () => {
    return 'main-20260111171420748'
  }
}

module.exports = nextConfig