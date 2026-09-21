"use client"

import { useEffect, useState, useRef } from "react"
import { useMediaQuery } from "@cora-ui/react/hooks"
import { useSearchParams } from "next/navigation"

import { AUTH_REDIRECT_PARAM } from "@/constants"

type UseSmartHeaderReturn = {
	visible: boolean
	pinned: boolean
}

export const useSmartHeader = (headerHeight = 80, scrollThreshold = 15): UseSmartHeaderReturn => {
	const lastScrollY = useRef(0)
	const visibleRef = useRef(true)
	const pinnedRef = useRef(false)

	const [visible, setVisible] = useState(true)
	const [pinned, setPinned] = useState(false)

	const mobile = useMediaQuery((query) => query.down("sm"))

	const updateVisible = (next: boolean) => {
		if (visibleRef.current !== next) {
			visibleRef.current = next
			setVisible(next)
		}
	}

	const updatePinned = (next: boolean) => {
		if (pinnedRef.current !== next) {
			pinnedRef.current = next
			setPinned(next)
		}
	}

	useEffect(() => {
		let ticking = false

		updatePinned(scrollY > 0)

		lastScrollY.current = scrollY

		const updateHeaderState = () => {
			updatePinned(scrollY > 0)

			if (!mobile) {
				updateVisible(true)

				lastScrollY.current = scrollY
				ticking = false

				return
			}

			if (scrollY <= 0) {
				updateVisible(true)

				lastScrollY.current = 0
				ticking = false

				return
			}

			const scrolledPastHeader = scrollY > headerHeight
			const scrollDiff = Math.abs(scrollY - lastScrollY.current)

			if (scrollDiff < scrollThreshold) {
				ticking = false
				return
			}

			if (scrollY > lastScrollY.current) {
				if (scrolledPastHeader) {
					updateVisible(false)
				}
			} else {
				updateVisible(true)
			}

			lastScrollY.current = scrollY
			ticking = false
		}

		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(updateHeaderState)
				ticking = true
			}
		}

		addEventListener("scroll", handleScroll, { passive: true })
		addEventListener("resize", handleScroll, { passive: true })

		return () => {
			removeEventListener("scroll", handleScroll)
			removeEventListener("resize", handleScroll)
		}
	}, [headerHeight, mobile, scrollThreshold])

	return { visible, pinned }
}

export const useLoginDialogState = () => {
	const searchParams = useSearchParams()

	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (searchParams.has(AUTH_REDIRECT_PARAM)) {
			const animationFrameId = requestAnimationFrame(() => setOpen(true))

			return () => cancelAnimationFrame(animationFrameId)
		}
	}, [searchParams])

	return [open, setOpen] as const
}