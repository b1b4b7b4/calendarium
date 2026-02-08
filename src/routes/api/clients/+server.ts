import { db } from "$lib/server/db";
import { clients } from "$lib/server/db/schema";
import { json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";
import { and, eq, like, or } from "drizzle-orm";
import { validate, errorResponse, successResponse } from "$lib/server/validation";

export const GET: RequestHandler = async ({ cookies, url }) => {
	try {
		const userId = cookies.get("jaiz");
		if (!userId) {
			return errorResponse("Not logged in", 401);
		}

		const query = url.searchParams.get("query");
		const id = url.searchParams.get("id");

		if (id) {
			const client = await db.select().from(clients).where(eq(clients.id, parseInt(id)));
			if (client.length === 0) {
				return errorResponse("Client not found", 404);
			}
			return successResponse(client);
		}

		const clientsList = await db.select().from(clients).where(
			and(
				eq(clients.userId, Number(userId)),
				or(
					query ? like(clients.name, `%${query}%`) : undefined,
					query ? like(clients.email, `%${query}%`) : undefined
				)
			)
		);

		return successResponse(clientsList);
	} catch (e: any) {
		if (e instanceof Response) {
			return e;
		}
		return errorResponse(e.message);
	}
};

const ClientDto = z.object({
	name: z.string(),
	gender: z.string(),
	date_of_birth: z.string(),
	country: z.string(),
	email: z.string().email(),
	phone_number: z.string(),
	address: z.string(),
	remark: z.string(),
});

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const userId = cookies.get("jaiz");
		if (!userId) {
			return errorResponse("Not logged in", 401);
		}

		const jsonBody = await request.json();
		const { name, gender, date_of_birth, country, email, phone_number, address, remark } = validate(ClientDto, jsonBody);

		await db.insert(clients).values({
			name,
			gender,
			date_of_birth,
			country,
			email,
			phone_number,
			address,
			remark,
			userId: Number(userId),
		});

		return json({ success: true });
	} catch (e: any) {
		if (e instanceof Response) {
			return e;
		}
		return errorResponse(e.message);
	}
};

export const PUT: RequestHandler = async ({ request, cookies, url }) => {
	try {
		const userId = cookies.get("jaiz");
		if (!userId) {
			return errorResponse("Not logged in", 401);
		}

		const jsonBody = await request.json();
		const { name, gender, date_of_birth, country, email, phone_number, address, remark } = validate(ClientDto, jsonBody);

		const id = url.searchParams.get("id");
		if (!id) {
			return errorResponse("Missing id");
		}

		await db.update(clients).set({
			name,
			gender,
			date_of_birth,
			country,
			email,
			phone_number,
			address,
			remark,
		}).where(
			and(
				eq(clients.userId, Number(userId)),
				eq(clients.id, parseInt(id))
			)
		);

		return json({ success: true });
	} catch (e: any) {
		if (e instanceof Response) {
			return e;
		}
		return errorResponse(e.message);
	}
};

export const DELETE: RequestHandler = async ({ cookies, url }) => {
	try {
		const userId = cookies.get("jaiz");
		if (!userId) {
			return errorResponse("Not logged in", 401);
		}

		const id = url.searchParams.get("id");
		if (!id) {
			return errorResponse("Missing id");
		}

		await db.delete(clients).where(
			and(
				eq(clients.userId, Number(userId)),
				eq(clients.id, parseInt(id))
			)
		);

		return json({ success: true });
	} catch (e: any) {
		if (e instanceof Response) {
			return e;
		}
		return errorResponse(e.message);
	}
};
