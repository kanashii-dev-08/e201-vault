import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "sm.ign.com",
			},
			{
				protocol: "https",
				hostname: "cloud.appwrite.io",
			},
		],
	},
};

export default nextConfig;
