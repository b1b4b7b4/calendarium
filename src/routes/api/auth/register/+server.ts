import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { hash } from "argon2";
import { validate, errorResponse } from "$lib/server/validation";

const RegisterDto = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const jsonBody = await request.json();
		const { email, password } = validate(RegisterDto, jsonBody);

		const user = await db.select().from(users).where(eq(users.email, email));
		if (user.length > 0) {
			return errorResponse("Email already exists");
		}

		const hashedPassword = await hash(password);

		const result = await db.insert(users).values({
			email,
			password: hashedPassword,
			first_name: "",
			last_name: "",
			phone_number: "",
		}).returning({ id: users.id });

		// better session
		cookies.set("jaiz", result[0].id.toString(), { path: "/" });

		return json({ success: true });
	} catch (e: any) {
		if (e instanceof Response) {
			return e;
		}
		return errorResponse(e.message);
	}
};
