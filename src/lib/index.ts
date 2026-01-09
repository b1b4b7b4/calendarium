import { goto, invalidateAll } from "$app/navigation";
import axios from "axios";
import { writable, get } from "svelte/store";

type User = {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
};
type Session = { user?: User, access?: string };
export const currentSession = writable<Session>({});

const apiUrl = "http://217.146.67.92/api/v1";
export const api = axios.create({
	baseURL: apiUrl,
	validateStatus: () => true,
})

api.interceptors.request.use((config) => {
	const token = get(currentSession).access;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

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

