import type { ComponentProps } from "react"

import { classNames } from "@cora-ui/react/utils"

type TitleProps = ComponentProps<"h1">

export const Title = (props: TitleProps) => {
	const {
		className,
		children,
		...restProps
	} = props

	return (
		<h1
			{...restProps}
			className={classNames("text-xl font-bold", className)}
		>
			{children}
		</h1>
	)
}