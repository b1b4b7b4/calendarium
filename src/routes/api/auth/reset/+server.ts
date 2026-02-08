import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { hash } from "argon2";
import { validate, errorResponse } from "$lib/server/validation";

const StepDto = z.object({
	step: z.number(),
});

const ReqCodeDto = z.object({
	email: z.string().email(),
});

const CodeDto = z.object({
	email: z.string().email(),
	code: z.string(),
});

const ResetDto = z.object({
	email: z.string().email(),
	code: z.string(),
	password: z.string(),
});

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const jsonBody = await request.json();

		const { step } = validate(StepDto, jsonBody);

		if (step === 1) {
			const { email } = validate(ReqCodeDto, jsonBody);
			const user = await db.select().from(users).where(eq(users.email, email));
			if (user.length) {
				const code = generateFourDigitCode();
				await db.update(users).set({
					reset_code: code,
				}).where(eq(users.id, user[0].id));

				// send email
			}
			return json({ success: true });
		} else if (step === 2) {
			const { email, code } = validate(CodeDto, jsonBody);
			const user = await db.select().from(users).where(eq(users.email, email));
			return json({ success: code == user[0].reset_code && user[0].reset_code != null });
		} else if (step === 3) {
			const { email, password, code } = validate(ResetDto, jsonBody);
			const user = await db.select().from(users).where(eq(users.email, email));

			if (code !== user[0].reset_code) {
				return errorResponse("Invalid code");
			}

			if (user.length) {
				const hashedPassword = await hash(password);
				await db.update(users).set({
					password: hashedPassword,
					reset_code: null,
				}).where(eq(users.id, user[0].id));

				// better session
				cookies.set("jaiz", user[0].id.toString(), { path: "/" });
				return json({ success: true });
			}
		}
		return errorResponse("Invalid step");
	} catch (e: any) {
		if (e instanceof Response) {
			return e;
		}
		return errorResponse(e.message);
	}
};

function generateFourDigitCode() {
	return Math.floor(Math.random() * 10000).toString().padStart(4, "0");
}
