/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "indigo-marten-791015.hostingersite.com",
      },
      {
        protocol: "https",
        hostname: "supabase.hushupidda.com",
      },
    ],
  },
};

export default nextConfig;
