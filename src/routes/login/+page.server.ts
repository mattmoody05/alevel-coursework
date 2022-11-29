import type { account } from '$lib/util/types';
import { error, redirect } from '@sveltejs/kit';
import { openDb } from '../../db/index';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const load: PageServerLoad = async ({ cookies }: PageServerLoadEvent) => {
	const token = cookies.get('token');
	if (token !== undefined) {
		// Check that the token is valid and that the user exists
		throw redirect(300, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }: RequestEvent) => {
		const data = await request.formData();

		// @ts-ignore
		const username: string = data.get('username');
		// @ts-ignore
		const password: string = data.get('password');
		const db = await openDb();

		if (username !== null && password !== null) {
			const reqAccount: account | undefined = await db.get(
				`SELECT * FROM account WHERE username = ?`,
				username
			);

			if (reqAccount !== undefined) {
				const passwordsMatch = await bcrypt.compare(password, reqAccount.password);

				if (passwordsMatch) {
					const token = jwt.sign(
						{ accountId: reqAccount.accountId },
						process.env['JWT_SIGNING_SECRET_KEY']
					);

					cookies.set('token', token);
					throw redirect(300, '/');
				}

				// Password does not matched the one stored in DB
				throw error(400, 'incorrect password');
			}

			// User not found with username specified not found
			throw error(400, 'user not found with username specified');
		}
		// username or password is null
		throw error(400, 'username or password is null');
	}
};
