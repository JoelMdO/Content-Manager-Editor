import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enables static export
  distDir: 'docs',  // Outputs files to /docs for GitHub Pages
  basePath: '/CMS', // Set base path to match the repo name
  assetPrefix: '/CMS/', // Prefix assets for GitHub Pages
};

export default nextConfig;
