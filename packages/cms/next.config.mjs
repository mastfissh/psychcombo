/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize server-only modules that cause issues with bundling
      config.externals = [...(config.externals || []), {
        'better-sqlite3': 'commonjs better-sqlite3',
        '@libsql/client': 'commonjs @libsql/client',
      }]
      
      // Ignore non-JS files from dependencies
      config.module.rules.push({
        test: /\.md$/,
        type: 'asset/source',
      })
    }
    return config
  },
}

export default nextConfig
