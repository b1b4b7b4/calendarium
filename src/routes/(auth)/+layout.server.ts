import { redirect, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ parent, url }) => {
	const parentData = await parent();
	if (!parentData.user) {
		redirect(303, "/login?redi=" + url.pathname);
	}
}
