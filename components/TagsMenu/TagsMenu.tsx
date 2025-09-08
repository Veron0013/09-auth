"use client"

import Link from "next/link"
import css from "./TagsMenu.module.css"
import { useEffect, useRef, useState } from "react"

export default function TagsMenu() {
	const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"]

	const [buttonTitle, setButtonTitle] = useState("Notes")
	const [isOpen, setIsOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement | null>(null)

	const toggle = () => {
		setIsOpen(!isOpen)
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [])

	return (
		<div ref={menuRef} className={css.menuContainer}>
			<button onClick={toggle} className={css.menuButton}>
				{buttonTitle} ▾
			</button>
			{isOpen && (
				<ul className={css.menuList}>
					<li className={css.menuItem}>
						<Link
							className={css.menuLink}
							href={`/notes/filter/All`}
							onClick={() => {
								toggle()
								setButtonTitle("All notes")
							}}
						>
							All notes
						</Link>
					</li>
					{tags.map((item: string, index: number) => {
						return (
							<li key={index} className={css.menuItem}>
								<Link
									className={css.menuLink}
									href={`/notes/filter/${item}`}
									onClick={() => {
										toggle()
										setButtonTitle(item)
									}}
								>
									{item}
								</Link>
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}
