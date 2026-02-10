import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { hash } from "argon2";
import { validate, errorResponse } from "$lib/server/validation";

//@ts-ignore
import nodemailer from "nodemailer";

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
				await sendCode(email, code);
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


async function sendCode(email: string, code: string) {
	const transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false, // Use true for port 465, false for port 587
		auth: {
			user: "maddison53@ethereal.email",
			pass: "jn7jnAPss4f63QBp6D",
		},
	});

	const info = await transporter.sendMail({
		from: '"Bazi App" <no-reply@bazi.app>',
		to: `${email}`,
		subject: "Bazi App - Reset password",
		text: `Your code is ${code}`,
		html: `<p>Your code is ${code}</p>`,
	});

	console.log("Message sent:", info.messageId);
	console.log("Message sent:", code);
}
