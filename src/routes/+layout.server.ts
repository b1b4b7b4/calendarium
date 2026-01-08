import { api } from "$lib";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ cookies }) => {
	const access = cookies.get("access");
	const res = await api("/user");
	console.log(res.data);
	return {
		user: res.data.id ? res.data : null
	};
}
