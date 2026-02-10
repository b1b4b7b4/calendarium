import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { verify } from "argon2";
import { validate, errorResponse } from "$lib/server/validation";

const UserDto = z.object({
	first_name: z.string(),
	last_name: z.string(),
	phone_number: z.string(),
});

export const PATCH: RequestHandler = async ({ request, cookies }) => {
	try {
		const userId = cookies.get("jaiz");
		if (!userId) {
			return errorResponse("Not logged in", 401);
		}

		const jsonBody = await request.json();
		const { first_name, last_name, phone_number } = validate(UserDto, jsonBody);

		await db.update(users).set({
			first_name,
			last_name,
			phone_number,
		}).where(
			eq(users.id, parseInt(userId))
		);

		return json({ success: true });
	} catch (e: any) {
		if (e instanceof Response) {
			return e;
		}
		return errorResponse(e.message);
	}
};
