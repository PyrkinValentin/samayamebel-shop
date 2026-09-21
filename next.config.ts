import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	allowedDevOrigins: ["192.168.1.2"],
	images: {
		remotePatterns: [
			new URL(`${process.env.MINIO_ENDPOINT}/**`),
		],
	},
	experimental: {
		authInterrupts: true,
	},
	headers: async () => [
		{
			source: "/:path*",
			headers: [
				{
					key: "X-DNS-Prefetch-Control",
					value: "on",
				},
				{
					key: "Strict-Transport-Security",
					value: "max-age=63072000; includeSubDomains; preload",
				},
				{
					key: "X-XSS-Protection",
					value: "1; mode=block",
				},
				{
					key: "X-Frame-Options",
					value: "SAMEORIGIN",
				},
				{
					key: "X-Content-Type-Options",
					value: "nosniff",
				},
				{
					key: "Referrer-Policy",
					value: "origin-when-cross-origin",
				},
				{
					key: "Permissions-Policy",
					value: "camera=(), microphone=(), interest-cohort=(), xr-spatial-tracking=()",
				},
			],
		},
	],
}

export default nextConfig
