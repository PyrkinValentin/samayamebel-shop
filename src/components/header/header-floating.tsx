"use client"

import type { ReactNode } from "react"

import { useRef } from "react"
import { useElementHeight } from "@/hooks"
import { useSmartHeader } from "./hooks"

import { classNames } from "@cora-ui/react/utils"

type HeaderFloatingProps = {
	children: ReactNode
}

export const HeaderFloating = (props: HeaderFloatingProps) => {
	const { children } = props

	const ref = useRef<HTMLDivElement>(null)
	const height = useElementHeight(ref)

	const { visible, pinned } = useSmartHeader(height, 5)

	return (
		<div
			className={
				classNames(
					"z-20 sticky top-0 w-full border-b bg-background transition duration-300 motion-reduce:transition-none",
					visible
						? "translate-y-0"
						: "-translate-y-[calc(100%+1px)]",
					pinned && visible
						? "border-b-separator"
						: "border-b-transparent",
				)
			}
		>
			<header
				ref={ref}
				className="mx-auto px-4 max-w-360 h-15.5 flex items-center"
			>
				{children}
			</header>
		</div>
	)
}