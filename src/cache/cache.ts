import Redis from "ioredis"

const globalForRedis = global as unknown as { redis: Redis | undefined }

export const redis = globalForRedis.redis ?? new Redis(process.env.REDIS_URL as string, {
	retryStrategy: (times) => Math.min(times * 50, 2000),
	maxRetriesPerRequest: 6,
	enableOfflineQueue: true,
})

if (process.env.NODE_ENV !== "production") {
	globalForRedis.redis = redis
}