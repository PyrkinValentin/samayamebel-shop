"use client"

import { signOutAction } from "./actions"

import { Menu } from "@cora-ui/react"
import { LogOut } from "lucide-react"

export const HeaderProfileMenuLogout = () => {
	const handleClickLogout = async () => {
		await signOutAction()
	}

	return (
		<Menu.Item onClick={handleClickLogout}>
			<LogOut/>
			Выйти
		</Menu.Item>
	)
}