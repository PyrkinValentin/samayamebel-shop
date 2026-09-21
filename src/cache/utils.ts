import { pack, unpack } from "msgpackr"
import { createHash } from "crypto"
import { redis } from "./cache"

const UNDEFINED_CACHE_MARKER = "__VAL_IS_UNDEFINED__"

const serialize = (value: unknown): Buffer => {
	if (Buffer.isBuffer(value)) {
		return value
	}

	try {
		return pack(value)
	} catch (error) {
		throw error
	}
}

const deserialize = <T>(data: Buffer | Uint8Array | null | undefined): T | undefined => {
	if (
		data === null ||
		data === undefined ||
		data.length === 0
	) {
		return undefined
	}

	try {
		return unpack(data) as T
	} catch {
		return undefined
	}
}

const generateDataKey = (tags: string[]): string => {
	const sortedTags = [...tags]
		.sort()
		.join(",")

	return createHash("sha256")
		.update(sortedTags)
		.digest("hex")
}

export const getCache = async <T>(...tags: string[]): Promise<T | undefined> => {
	if (tags.length === 0) return

	try {
		const dataKey = generateDataKey(tags)
		const data = await redis.getBuffer(dataKey)

		if (data && data.toString() === UNDEFINED_CACHE_MARKER) {
			return
		}

		return deserialize<T>(data)
	} catch {
		return
	}
}

export const setCache = async (value: unknown, ttl: number, ...tags: string[]) => {
	if (tags.length === 0) return

	try {
		const dataKey = generateDataKey(tags)
		const pipeline = redis.pipeline()

		const payload = value === undefined
			? Buffer.from(UNDEFINED_CACHE_MARKER)
			: serialize(value)

		pipeline.set(dataKey, payload, "EX", ttl)

		tags.forEach((tag) => {
			pipeline.sadd(tag, dataKey)
			pipeline.expire(tag, ttl)
		})

		await pipeline.exec()
	} catch {
	}
}

export const invalidateCache = async (...tags: string[]) => {
	if (tags.length === 0) return

	try {
		for (const tag of tags) {
			const dataKeys = await redis.smembers(tag)

			if (dataKeys && dataKeys.length > 0) {
				const pipeline = redis.pipeline()

				dataKeys.forEach((key) => pipeline.del(key))
				pipeline.del(tag)

				await pipeline.exec()
			}
		}
	} catch {
	}
}