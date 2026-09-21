import type { Metadata } from "next"

import Link from "next/link"
import { Button, Empty } from "@cora-ui/react"
import { CircleAlert } from "lucide-react"

export const metadata: Metadata = {
	title: "404 - Страница не найдена",
}

const NotFound = () => {
	return (
		<div className="flex-1 flex items-center justify-center">
			<Empty.Root>
				<Empty.Icon>
					<CircleAlert/>
				</Empty.Icon>

				<Empty.Title>Страница не найдена</Empty.Title>
				<Empty.Description>Возможно страница была удалена или не существует</Empty.Description>

				<Button
					nativeButton={false}
					render={<Link href="/"/>}
					variant="outline"
					className="mt-4"
				>
					На главную
				</Button>
			</Empty.Root>
		</div>
	)
}

export default NotFound