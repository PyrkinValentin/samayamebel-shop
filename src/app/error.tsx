"use client"

import Link from "next/link"
import { Button, Empty } from "@cora-ui/react"
import { CircleX, RotateCcw } from "lucide-react"

export type ErrorProps = {
	reset: () => void
}

const Error = (props: ErrorProps) => {
	const { reset } = props

	return (
		<div className="flex-1 flex items-center justify-center">
			<Empty.Root>
				<Empty.Icon>
					<CircleX/>
				</Empty.Icon>

				<Empty.Title>Ой! Что-то пошло не так...</Empty.Title>
				<Empty.Description>Не переживайте, вы можете обновить страницу или вернуться на главную.</Empty.Description>

				<div className="mt-4 flex gap-2">
					<Button
						nativeButton={false}
						render={<Link href="/"/>}
						variant="outline"
					>
						На главную
					</Button>

					<Button
						variant="outline"
						onClick={reset}
					>
						<RotateCcw/> Обновить
					</Button>
				</div>
			</Empty.Root>
		</div>
	)
}

export default Error