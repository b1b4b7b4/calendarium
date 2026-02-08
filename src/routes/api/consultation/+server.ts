import { db } from "$lib/server/db";
import { consultations } from "$lib/server/db/schema";
import { json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";
import { validate, errorResponse } from "$lib/server/validation";

const ConsultationDto = z.object({
	name: z.string(),
	email: z.string().email(),
	reason: z.string(),
	description: z.string(),
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const jsonBody = await request.json();
		const { name, email, reason, description } = validate(ConsultationDto, jsonBody);

		await db.insert(consultations).values({
			name,
			email,
			reason,
			description,
		});

		return json({ success: true });
	} catch (e: any) {
		if (e instanceof Response) {
			return e;
		}
		return errorResponse(e.message);
	}
};
