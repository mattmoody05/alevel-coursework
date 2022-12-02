// POST BODY
// username: string
// currentPassword: string
// newPassword: string

import type { account } from '$lib/util/types';
import { openDb } from '../../../db/index';
import type { RequestEvent, RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const body = await request.json();
	const username = body['username'];
	const currentPassword = body['currentPassword'];
	const newPassword = body['newPassword'];
	const db = await openDb();

	const reqAccount: account | undefined = await db.get(
		`SELECT * FROM account WHERE username = ?`,
		username
	);
	if (reqAccount !== undefined) {
		const passwordsMatch = await bcrypt.compare(currentPassword, reqAccount.password);
		if (passwordsMatch) {
			const newPasswordHashed = await bcrypt.hash(newPassword, 10);

			db.run('UPDATE account SET password = ? WHERE username = ?', newPasswordHashed, username);
			return new Response('Success');
		}

		// Password does not matched the one stored in DB
		return new Response('Username or password incorrect');
	}

	// User not found with username specified not found
	return new Response('Username or password incorrect');
};
