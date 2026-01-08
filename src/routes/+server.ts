import { json, type ServerLoad } from "@sveltejs/kit";

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

export const DELETE: ServerLoad = async ({ cookies }) => {
	cookies.delete("access", { path: '/' });
	cookies.delete("refresh", { path: '/' });
	return json({ success: true });
}
