/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:username*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=10, stale-while-revalidate=59',
          },
        ],
      },
      {
        source: '/api/v1',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=1, stale-while-revalidate=59',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
