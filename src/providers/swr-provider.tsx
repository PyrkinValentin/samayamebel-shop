"use client"

import type { ReactNode } from "react"

import { SWRConfig } from "swr"

const fetcher = async (url: string) => {
	const res = await fetch(url)
	if (!res.ok) throw new Error("Ошибка при загрузке данных с сервера")
	return res.json()
}

type SwrProviderProps = {
	children: ReactNode
}

export const SwrProvider = (props: SwrProviderProps) => {
	const { children } = props

	return (
		<SWRConfig value={{ fetcher, dedupingInterval: 4000 }}>
			{children}
		</SWRConfig>
	)
}