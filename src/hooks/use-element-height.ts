"use client"

import type { RefObject } from "react"

import { useState, useEffect } from "react"

export const useElementHeight = <T extends HTMLElement>(ref: RefObject<T | null>) => {
	const [height, setHeight] = useState(0)

	useEffect(() => {
		const element = ref.current

		if (!element) return

		const resizeObserver = new ResizeObserver(([entry]) => {
			if (entry) {
				const currentHeight =
					entry.borderBoxSize?.[0]?.blockSize ??
					entry.target.getBoundingClientRect().height
				
				setHeight(Math.round(currentHeight))
			}
		})

		resizeObserver.observe(element)

		return () => resizeObserver.disconnect()
	}, [ref])

	return height
}