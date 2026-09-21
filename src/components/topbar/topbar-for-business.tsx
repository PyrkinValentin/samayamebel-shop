import { Link } from "@cora-ui/react"
import NextLink from "next/link"

export const TopbarForBusiness = () => {
	return (
		<Link
			render={<NextLink href="/for-business"/>}
			className="text-xs after:h-0"
		>
			Для бизнеса
		</Link>
	)
}