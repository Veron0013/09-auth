import { createPortal } from "react-dom"
import css from "./ConfirnMessage.module.css"
import { CONFIRM_DELETE_MESSAGE } from "@/lib/vars"
import type { ConfirmDimentions } from "@/types/note"
import { useEffect } from "react"

interface ConfirmMessageProps {
	confirmPosition: ConfirmDimentions
	onConfirm: () => void
	onCancel: () => void
}

//Shure you want to delete this note?
export default function ConfirmMessage({ confirmPosition, onConfirm, onCancel }: ConfirmMessageProps) {
	const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onCancel()
		}
	}

	//escape close
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onCancel()
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		document.body.style.overflow = "hidden"

		return () => {
			document.removeEventListener("keydown", handleKeyDown)
			document.body.style.overflow = ""
		}
	}, [onCancel])

	return createPortal(
		<div className={css.backdrop} onClick={handleBackdropClick}>
			<div
				className={css.confirmWrapper}
				style={{
					top: confirmPosition.top,
					left: confirmPosition.left,
					width: confirmPosition.width,
					height: confirmPosition.height,
				}}
			>
				<div className={css.modal}>
					<p className={css.text}>{CONFIRM_DELETE_MESSAGE}</p>
					<div className={css.actions}>
						<button className={css.confirm} onClick={onConfirm}>
							Yes
						</button>
						<button className={css.cancel} onClick={onCancel}>
							No
						</button>
					</div>
				</div>
			</div>
		</div>,
		document.body
	)
}
