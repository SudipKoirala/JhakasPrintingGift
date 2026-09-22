import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["fabric", "three"],
  serverExternalPackages: [
    "@imgly/background-removal",
    "@huggingface/transformers",
    "onnxruntime-web",
    "onnxruntime-node",
    "sharp",
  ],
};

export default nextConfig;
