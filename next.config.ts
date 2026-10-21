import path from "node:path";
import type { NextConfig } from "next";

// Ada package-lock.json liar di C:\Users\hp sehingga Next salah mendeteksi
// workspace root (seluruh folder home ikut dipindai/di-watch -> dev lambat).
// Kunci root ke folder frontend ini.
const projectRoot = path.resolve(process.cwd());

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["postgres"],
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
