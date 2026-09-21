import type { Viewport } from "next"
import type { ReactNode } from "react"

import "@/styles/globals.css"

import { Inter } from "next/font/google"
import { Toaster } from "@/components/toast"
import { Topbar } from "@/components/topbar"
import { Header } from "@/components/header"

type RootLayoutProps = {
	children: ReactNode
}

export const viewport: Viewport = {
	viewportFit: "cover",
	minimumScale: 1,
	maximumScale: 1,
}

const inter = Inter({
	variable: "--font-sans",
	subsets: ["cyrillic", "cyrillic-ext", "latin"],
})

const RootLayout = (props: RootLayoutProps) => {
	const { children } = props

	return (
		<html
			lang="ru"
			data-scroll-behavior="smooth"
			className={inter.variable}
		>
			<body>
				<div className="root min-h-dvh flex flex-col">
					<Toaster>
						<Topbar/>
						<Header/>

						<div className="mx-auto p-4 w-full max-w-360 flex-1 flex flex-col">
							{children}
						</div>
					</Toaster>
				</div>
			</body>
		</html>
	)
}

export default RootLayout
