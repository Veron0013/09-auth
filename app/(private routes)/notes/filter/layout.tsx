import Loading from "@/app/loading"
import { Suspense } from "react"
import css from "./@sidebar/Sidebar.module.css"

export default function NotesLayout({
	children,
	sidebar,
}: Readonly<{
	children: React.ReactNode
	sidebar: React.ReactNode
}>) {
	return (
		<div className={css.filterLayout}>
			<Suspense fallback={<Loading />}>{sidebar}</Suspense>
			{children}
		</div>
	)
}
