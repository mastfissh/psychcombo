/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize server-only modules
      config.externals = config.externals || []
      config.externals.push({
        'better-sqlite3': 'commonjs better-sqlite3',
      })
    }
    return config
  },
}

export default nextConfig
