import { json } from '@sveltejs/kit';
import { z } from 'zod';

type FieldErrors = Record<string, string>;

/**
 * Format Zod errors into a simple { field: "error message" } object
 */
export function formatZodErrors(zodError: z.ZodError): FieldErrors {
	const fieldErrors = zodError.flatten().fieldErrors as Record<string, string[] | undefined>;
	return Object.fromEntries(
		Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0] ?? ''])
	);
}

/**
 * Create an error response with { error: "message" }
 */
export function errorResponse(message: string, status = 400) {
	return json({ error: message }, { status });
}

/**
 * Create a field errors response with { field: "error" }
 */
export function fieldErrorsResponse(errors: FieldErrors, status = 400) {
	return json(errors, { status });
}

/**
 * Create a success response with optional data
 */
export function successResponse<T>(data?: T) {
	return json(data ? { success: true, data } : { success: true });
}

/**
 * Handle validation and return parsed data or throw response
 */
export function validate<T extends z.ZodSchema>(
	schema: T,
	data: unknown
): z.infer<T> {
	const result = schema.safeParse(data);
	if (!result.success) {
		throw fieldErrorsResponse(formatZodErrors(result.error));
	}
	return result.data;
}
