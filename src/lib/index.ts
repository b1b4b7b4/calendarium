import { goto } from "$app/navigation";
import axios from "axios";
import { writable } from "svelte/store";

const apiUrl = "http://217.146.67.92/api/v1";
export const api = axios.create({
	baseURL: apiUrl,
	validateStatus: () => true,
})

export async function saveSession(res: any) {
	const data = await axios.post("/", res, { validateStatus: () => true });
	if (data.status !== 200) {
		return "Ошибка при установке сессии. Пожалуйста, попробуйте еще раз.";
	} else {
		goto("/");
		return ""
	}
}

export async function removeSession() {
	const data = await axios.delete("/", { validateStatus: () => true });
	if (data.status !== 200) {
		return "Ошибка при удалении сессии. Пожалуйста, попробуйте еще раз.";
	} else {
		goto("/");
		return ""
	}
}


