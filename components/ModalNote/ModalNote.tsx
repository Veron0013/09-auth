"use client"
import { createPortal } from "react-dom"
import css from "./ModalNote.module.css"
import { type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface ModalProps {
	backPage: string
	children: ReactNode
}

export default function ModalNote({ children, backPage }: ModalProps) {
	const router = useRouter()

	const close = () => router.back()

	const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			close()
		}
	}

	//console.log("modal note")

	return createPortal(
		<div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
			<div className={css.modal}>
				<button onClick={close}>{`< Go back to ${backPage === "All" ? "All notes" : backPage}`}</button>
				{children}
			</div>
		</div>,
		document.body
	)
}
