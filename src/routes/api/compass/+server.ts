import { db } from "$lib/server/db";
import { compasses, main_images, type clients } from "$lib/server/db/schema";
import { errorResponse, successResponse } from "$lib/server/validation";
import type { RequestHandler } from "@sveltejs/kit";
import { eq, and, or, like } from "drizzle-orm";

export const GET: RequestHandler = async ({ cookies, url }) => {
	try {
		const userId = cookies.get("jaiz");
		if (!userId) {
			return errorResponse("Not logged in", 401);
		}

		const mainImageId = url.searchParams.get("main_image_id");
		if (mainImageId) {
			return successResponse(await db.select().from(compasses).where(eq(main_images.id, parseInt(mainImageId))))
		}

		return successResponse(await db.select().from(compasses).where(eq(compasses.global, true)));
	} catch (e: any) {
		if (e instanceof Response) {
			return e;
		}
		return errorResponse(e.message);
	}
};
