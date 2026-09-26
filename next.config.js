/** @type {import('next').NextConfig} */
const basePath = process.env.GITHUB_ACTIONS ? '/Google-PromptWar-4' : '';
module.exports = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
};
