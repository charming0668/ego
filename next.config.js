/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repo = "ego";
const basePath = isProd ? `/${repo}` : "";

const nextConfig = {
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = require("@next/mdx")();

module.exports = withMDX(nextConfig);
