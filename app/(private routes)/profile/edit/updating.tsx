"use client"

import { ScaleLoader } from "react-spinners"
import css from "@/app/Loader.module.css"
import type { CSSProperties } from "react"
import { UPDATING_MAIN_MESSAGE } from "@/lib/vars"

const Updating = () => {
	const override: CSSProperties = {
		display: "block",
		margin: "0 auto",
		borderColor: "#004182",
	}

	//console.log("load")

	return (
		<div className={css.wrapper}>
			<ScaleLoader
				color="#004182"
				loading={true}
				cssOverride={override}
				//size={150}
				aria-label="Updating...."
				data-testid="updater"
			/>
			<span className={css.text}>{UPDATING_MAIN_MESSAGE}</span>
		</div>
	)
}

export default Updating
