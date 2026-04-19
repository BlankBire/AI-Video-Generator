const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  reactStrictMode: false,
  poweredByHeader: false,
};

module.exports = nextConfig;
