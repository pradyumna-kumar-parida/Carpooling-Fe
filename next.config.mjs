/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  reactCompiler: true,
  basePath: "/carpooling",

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
