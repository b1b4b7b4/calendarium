import { successResponse } from "$lib/server/validation";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete("jaiz", { path: "/" });
	return successResponse()
}
