import { goto, invalidateAll } from "$app/navigation";
import axios from "axios";
import { writable, get } from "svelte/store";
import type { UserProfile } from "./types";
import { apiUrl } from "./constants";

type Session = { user?: UserProfile, access?: string };
export const currentSession = writable<Session>({});

export const api = axios.create({
	baseURL: apiUrl,
})

api.interceptors.request.use((config) => {
	const token = get(currentSession).access;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401 && get(currentSession).access) {
			try {
				console.log("Access token expired, attempting to refresh...");
				const res = await axios.patch('/');
				const newAccess = res.data.access;
				if (!newAccess) throw new Error("No new access token");
				currentSession.update(x => {
					return { ...x, access: newAccess };
				})
				return api(error.config);
			} catch {
				currentSession.set({});
				goto('/login');
			}
		}
		return Promise.reject(error);
	}
);

export async function saveSession(res: any) {
	const data = await axios.post("/", res, { validateStatus: () => true });
	if (data.status !== 200) {
		return "Ошибка при установке сессии. Пожалуйста, попробуйте еще раз.";
	} else {
		await invalidateAll()
		return ""
	}
}

export async function removeSession() {
	const data = await axios.delete("/", { validateStatus: () => true });
	if (data.status !== 200) {
		return "Ошибка при удалении сессии. Пожалуйста, попробуйте еще раз.";
	} else {
		await invalidateAll()
		return ""
	}
}

export const settingsModal = writable(false);

