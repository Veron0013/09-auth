import axios, { AxiosError } from "axios"

export type ApiError = AxiosError<{ error: string }>

export const api = axios.create({
	baseURL: "https://notehub-api.goit.study",
	//baseURL: "http://localhost:3030",
	//baseURL: "https://zero1-express.onrender.com",
	withCredentials: true,
})
