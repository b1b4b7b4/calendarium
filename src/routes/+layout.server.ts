import { api } from "$lib";
import { apiUrl } from "$lib/constants";
import { localizeHref } from "$lib/paraglide/runtime";
import type { ServerLoad } from "@sveltejs/kit";
import axios from "axios";
import { decode } from "jsonwebtoken"

export const load: ServerLoad = async ({ cookies }) => {
	try {
		const access = cookies.get("access");
		const decodedData = decode(access || "", { complete: true });
		const userId = (decodedData?.payload as any).user_id - 1
		console.log("Decoded user ID:", userId);
		const res = await axios(`${apiUrl}/user/${userId}`, {
			headers: { Authorization: `Bearer ${access}` }
		});
		return {
			userId,
			user: res.data,
			access
		};
	} catch (error) {
		console.error("Error in +layout.server.ts load function:", error);
		return {
			userId: null,
			user: null,
			access: null
		};
	}
}

