import type { Viewport } from "next"
import type { ReactNode } from "react"

import "@/styles/globals.css"

import { Inter } from "next/font/google"
import { SwrProvider } from "@/providers"
import { Toaster } from "@/components/toast"
import { getTopbarData, Topbar } from "@/components/topbar"
import { getHeaderData, Header } from "@/components/header"

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

const RootLayout = async (props: RootLayoutProps) => {
	const { children } = props

	const [topbarData, headerData] = await Promise.all([
		getTopbarData(),
		getHeaderData(),
	])

	return (
		<html
			lang="ru"
			data-scroll-behavior="smooth"
			className={inter.variable}
		>
			<body>
				<div className="root min-h-dvh flex flex-col">
					<SwrProvider>
						<Toaster>
							<Topbar {...topbarData}/>
							<Header {...headerData}/>

							<div className="mx-auto p-4 w-full max-w-360 flex-1 flex flex-col">
								{children}
							</div>
						</Toaster>
					</SwrProvider>
				</div>
			</body>
		</html>
	)
}

export default RootLayout
