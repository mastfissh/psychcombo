import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: false,
  },
  typescript: {
    // Ignore type errors during build due to auto-generated importMap.js
    ignoreBuildErrors: true,
  },
}

export default withPayload(nextConfig)
