/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/v1',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, max-age=900, stale-while-revalidate=3600',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
