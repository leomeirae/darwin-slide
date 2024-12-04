/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "instagram.frec5-1.fna.fbcdn.net",
        
      },
    ],
    domains: ['scontent.cdninstagram.com'],
  },
}

export default nextConfig