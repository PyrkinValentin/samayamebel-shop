"use client"

import { useState, useEffect } from "react"

import { formatDistanceStrict, isAfter } from "date-fns"
import { ru } from "date-fns/locale"

export const useCountdown = (targetDate?: Date): [boolean, string | undefined] => {
	const [active, setActive] = useState(true)
	const [timeToWait, setTimeToWait] = useState<string>()

	useEffect(() => {
		if (!targetDate) return

		const calculate = () => {
			const active = isAfter(targetDate, new Date())
			const timeToWait = formatDistanceStrict(targetDate, new Date(), { locale: ru, addSuffix: true })

			setActive(active)
			setTimeToWait(timeToWait)
		}

		calculate()

		const intervalId = setInterval(calculate, 1000)

		return () => clearInterval(intervalId)
	}, [targetDate])

	return [active, timeToWait]
}