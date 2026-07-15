/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev.maastrixdemo.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "http",
        hostname: "192.168.1.8",
         port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
};

export default nextConfig;
