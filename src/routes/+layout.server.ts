import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import type { ServerLoad } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load: ServerLoad = async ({ cookies }) => {
	const token = cookies.get("jaiz");
	if (token) {
		const user = await db.select({
			id: users.id,
			first_name: users.first_name,
			last_name: users.last_name,
			email: users.email,
		}).from(users).where(eq(users.id, Number(token)));
		if (user.length) {
			return {
				user: user[0],
			};
		}
	}

	return {
		user: null,
	};
}

