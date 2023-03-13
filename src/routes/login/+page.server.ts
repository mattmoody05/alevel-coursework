import { invalid, redirect } from '@sveltejs/kit';
import { openDb } from '../../db/index';
import { JWT_SIGNING_SECRET_KEY } from '$env/static/private';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { AccountTable } from '$lib/util/db';

export const load: PageServerLoad = async ({ cookies, locals }: PageServerLoadEvent) => {
	if (locals.account !== undefined) {
		// The user is already logged in
		// Redirects the user to the dashboard
		throw redirect(300, '/');
	} else {
		return {};
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to login to the system
	login: async ({ request, cookies }: RequestEvent) => {
		// Retrieves the data from the HTML form
		const data = await request.formData();
		const username: string = data.get('username') as string;
		const password: string = data.get('password') as string;

		// Creates a new instance of the database
		const db = await openDb();

		if (username !== '' && password !== '') {
			// Attempts to fetch the account from the databse given the username submitted
			const reqAccount: AccountTable | undefined = await db.get(
				`SELECT * FROM account WHERE username = ?`,
				username
			);

			if (reqAccount !== undefined) {
				// Compares the hashed password in the database with a hash of the input password
				const passwordsMatch = await bcrypt.compare(password, reqAccount.password);
				if (passwordsMatch) {
					// Creates a JWT and sets it as a cookie on the client so that it can be used for authentication
					const token = jwt.sign({ accountId: reqAccount.accountId }, JWT_SIGNING_SECRET_KEY);
					cookies.set('token', token);

					// Redirects the user to the dashboard
					// 307: Temporary redirect rcode
					throw redirect(307, '/');
				} else {
					// The password entered by the user does not match the one that is stored in the databse
					// Returns a validation error to the HTML template so that it can be shown to the user
					// Returns the email so that it can be retained in the input field
					// Password is erased from input field
					return invalid(400, {
						message: 'Username or password is incorrect',
						data: {
							username
						}
					});
				}
			} else {
				// An account with the username specified could not be found in the database
				// Returns a validation error to the HTML template so that it can be shown to the user
				// Returns the email so that it can be retained in the input field
				// Password is erased from input field
				return invalid(400, {
					message: 'Username or password is incorrect',
					data: {
						username
					}
				});
			}
		} else {
			// The username or password fields had been left blank
			// Returns a validation error to the HTML template so that it can be shown to the user
			// Returns the email so that it can be retained in the input field
			// Password is erased from input field
			return invalid(400, {
				message:
					'Username or password is empty, please ensure that you specify a username and password.',
				data: {
					username
				}
			});
		}
	}
};
