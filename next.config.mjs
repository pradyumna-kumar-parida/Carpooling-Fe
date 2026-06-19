/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev.maastrixdemo.com",
      },
    ],
  },
};

export default nextConfig;
