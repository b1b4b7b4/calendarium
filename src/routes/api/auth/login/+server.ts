import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { verify } from "argon2";
import { validate, errorResponse } from "$lib/server/validation";

const LoginDto = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const jsonBody = await request.json();
		const { email, password } = validate(LoginDto, jsonBody);

		const user = await db.select().from(users).where(eq(users.email, email));
		if (user.length === 0) {
			return errorResponse("Incorrect credentials", 401);
		}

		const isPasswordCorrect = await verify(user[0].password, password);
		if (!isPasswordCorrect) {
			return errorResponse("Incorrect credentials", 401);
		}

		// better session
		cookies.set("jaiz", user[0].id.toString(), { path: "/" });

		return json({ success: true });
	} catch (e: any) {
		if (e instanceof Response) {
			return e;
		}
		return errorResponse(e.message);
	}
};
