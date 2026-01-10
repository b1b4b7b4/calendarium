import { apiUrl } from "$lib/constants";
import { json, type ServerLoad } from "@sveltejs/kit";
import axios from "axios";

export const POST: ServerLoad = async ({ cookies, request }) => {
	try {
		const data = await request.json();
		cookies.set("access", data.access, { path: '/' });
		cookies.set("refresh", data.refresh, { path: '/' });
		return json({ success: true });
	} catch (error: any) {
		return json({ success: false, error: error.message }, { status: 400 });
	}
}

export const PATCH: ServerLoad = async ({ cookies }) => {
	const ref = cookies.get("refresh");

	if (!ref) {
		return json({ success: false, error: "No refresh token" }, { status: 401 });
	}

	const res = await axios.post(`${apiUrl}/token/refresh/`, { refresh: ref }, { validateStatus: () => true });
	if (res.status !== 200) {
		return json({ success: false, error: "Failed to refresh token" }, { status: 401 });
	}

	cookies.set("access", res.data.access, { path: '/' });
	cookies.set("refresh", res.data.refresh, { path: '/' });

	return json({ success: true, access: res.data.access });
}

export const DELETE: ServerLoad = async ({ cookies }) => {
	cookies.delete("access", { path: '/' });
	cookies.delete("refresh", { path: '/' });
	return json({ success: true });
}
