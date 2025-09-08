import { useState } from "react"
import css from "./SearchBox.module.css"

interface SearchBoxProps {
	onQueryChange: (queryText: string) => void
}

export default function SearchBox({ onQueryChange }: SearchBoxProps) {
	const [inputValue, setInputValue] = useState("")

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setValues(value)
	}

	const handleClear = () => {
		setValues()
	}

	const setValues = (value: string = "") => {
		setInputValue(value)
		onQueryChange(value.trim())
	}

	return (
		<div className={css.inputWrapper}>
			<input className={css.input} type="text" placeholder="Search notes" value={inputValue} onChange={handleChange} />
			{inputValue.length > 0 && (
				<button type="button" onClick={handleClear} className={css.clear}>
					x
				</button>
			)}
		</div>
	)
}
