import { getCategories } from "@/lib/api"
import css from "./Sidebar.module.css"
import Link from "next/link"

//export default async function SideBar() {

export default function SidebarNotes() {
	//await new Promise((r) => setTimeout(r, 3000))
	const tags: string[] = getCategories()
	return (
		<aside>
			<div className={css.menuContainer}>
				<ul className={css.menuList}>
					<li className={css.menuItem} key={tags?.length + 1 || 0}>
						<Link href={`/notes/filter/All`} className={css.menuLink}>
							All notes
						</Link>
					</li>
					{tags?.length > 0 &&
						tags.map((item: string, index: number) => {
							return (
								<li className={css.menuItem} key={index}>
									<Link href={`/notes/filter/${item}`} className={css.menuLink}>
										{item}
									</Link>
								</li>
							)
						})}
				</ul>
			</div>
		</aside>
	)
}
