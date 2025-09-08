import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "edu.goit.global",
			},
		],
	},
}

export default nextConfig
