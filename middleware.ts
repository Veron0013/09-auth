// middleware.ts

import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { checkServerSession } from "./lib/api/serverApi"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

const privateRoutes = ["/profile", "/notes"]
const publicRoutes = ["/sign-in", "/sign-up"]

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const cookieStore = await cookies()
	const accessToken = cookieStore.get("accessToken")?.value
	const refreshToken = cookieStore.get("refreshToken")?.value
	const sessionId = cookieStore.get("sessionId")?.value

	const ip =
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"

	console.log("IP:", ip)

	const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
	const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route))

	// === функція для створення відповіді з IP ===
	const withIpHeader = (response: NextResponse) => {
		response.headers.set("x-client-ip", ip)
		return response
	}

	if (!accessToken) {
		if (refreshToken && sessionId) {
			const data = await checkServerSession()

			if (!data.data.success) {
				console.log("go home data")
				const res = goHome(cookieStore, request)
				return withIpHeader(res)
			}

			const setCookie = data.headers["set-cookie"]

			const response = isPrivateRoute ? NextResponse.next() : NextResponse.redirect(new URL("/", request.url))

			if (setCookie) {
				const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie]
				for (const c of cookieArray) {
					response.headers.append("set-cookie", c)
				}
			}
			return withIpHeader(response)
		} else {
			console.log("go home", sessionId, refreshToken)
			const res = goHome(cookieStore, request)
			return withIpHeader(res)
		}
	}

	if (isPublicRoute) {
		const res = NextResponse.redirect(new URL("/", request.url))
		return withIpHeader(res)
	}

	if (isPrivateRoute) {
		const res = NextResponse.next()
		return withIpHeader(res)
	}

	// fallback
	return withIpHeader(NextResponse.next())
}

export const config = {
	matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
}

const goHome = (cookieStore: ReadonlyRequestCookies, request: NextRequest) => {
	cookieStore.delete("accessToken")
	cookieStore.delete("refreshToken")
	cookieStore.delete("sessionId")
	return NextResponse.redirect(new URL("/", request.url))
}
