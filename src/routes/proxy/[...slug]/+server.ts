import { apiUrl } from '$lib/constants';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
	return await handler(event);
}
export async function POST(event: RequestEvent) {
	return await handler(event);
}
export async function PUT(event: RequestEvent) {
	return await handler(event);
}
export async function DELETE(event: RequestEvent) {
	return await handler(event);
}
export async function PATCH(event: RequestEvent) {
	return await handler(event);
}

async function handler(event: RequestEvent) {
	const { params, request } = event;
	const slug = params.slug || '';
	const targetUrl = apiUrl;

	const useBody = request.method !== 'GET' && request.method !== 'HEAD'
	const response = await fetch(`${targetUrl}/${slug}`, {
		method: request.method,
		headers: {
			...Object.fromEntries(request.headers.entries()),
			host: new URL(targetUrl).host,
		},
		body: useBody ? request.body : undefined,
		...(useBody && { duplex: 'half' }),
	});

	const body = await response.text();

	return new Response(body, {
		status: response.status,
		headers: Object.fromEntries(response.headers.entries()),
	});
}

