//import { Suspense } from "react"
//import Loading from "../../loading"

//export default async function NotesLayout({
export default function NotesLayout({
	children,
	sidebar,
}: Readonly<{
	children: React.ReactNode
	sidebar: React.ReactNode
}>) {
	return (
		<div style={{ display: "flex", gap: "24px", flexGrow: "1" }}>
			{/*<Suspense fallback={<Loading />}>{sidebar}</Suspense>*/}
			{sidebar}
			{children}
		</div>
	)
}
//app/notes/filter/@sidebar/default.tsx
//app/notes/layout.tsx
