import type { NextConfig } from "next";
const WebpackObfuscator = require('webpack-obfuscator');

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.plugins.push(
        new WebpackObfuscator({
          rotateStringArray: true,
          stringArray: true,
          stringArrayThreshold: 0.75,
          selfDefending: true,
          disableConsoleOutput: true,
        })
      );
    }
    return config;
  },
};

export default nextConfig;