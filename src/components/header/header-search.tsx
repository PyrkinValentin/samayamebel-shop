import { Button, Input, InputGroup } from "@cora-ui/react"
import { Search } from "lucide-react"

export const HeaderSearch = () => {
	return (
		<div>
			<InputGroup className="hidden sm:flex w-100 rounded-md bg-surface border border-separator ring-transparent">
				<Input placeholder="Поиск по товарам"/>
				<Search/>
			</InputGroup>

			<Button
				iconOnly
				aria-label="Поиск по товарам"
				variant="ghost"
				className="flex sm:hidden"
			>
				<Search className="size-5"/>
			</Button>
		</div>
	)
}