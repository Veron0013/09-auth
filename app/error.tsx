"use client"

import { useEffect, useState } from "react"
import css from "./ErrorMessage.module.css"
import { ERROR_MAIN_MESSAGE } from "@/lib/vars"

type Props = {
	error: Error | undefined
}

const Error = ({ error }: Props) => {
	const [visible, setVisible] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => setVisible(false), 3000)
		return () => clearTimeout(timer)
	}, [])

	if (!visible) return null
	return (
		<div className={css.wrapper}>
			<p className={css.text}>{ERROR_MAIN_MESSAGE}</p>
			<p className={css.text}>{error?.message ? error.message : "Could not fetch note details"}</p>
		</div>
	)
}

export default Error
