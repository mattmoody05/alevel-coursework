import { openDb } from '../../../../db/index';
import type { RequestEvent } from './$types';

export const POST = async ({ request }: RequestEvent) => {
	const query = await request.text();

	const db = await openDb();
	await db.run(query);

	return new Response('OK');
};
