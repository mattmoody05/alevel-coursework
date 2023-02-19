import type { Actions, RequestEvent } from './$types';
import { invalid } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { getAccountByUsername, createAccount, createParent } from '$lib/util/newDb';

export const actions: Actions = {
	// Handles the user submitting the form to register for the system
	register: async ({ request }: RequestEvent) => {
		// Fetches data from the HTML form
		const data = await request.formData();
		const username = data.get('username') as string;

		// Checks whether an account exists by fetching by the input username
		// If an account is found, an account object will be returned
		// If no account is found, undefined will be returned
		const account = await getAccountByUsername(username);

		if (account !== undefined) {
			// An account with the usernae input already exists
			// Returns a validation error
			// 400: Bad request code
			return invalid(400, {
				message: 'An account with that username already exists, please choose another username',
				data: {
					username
				}
			});
		} else {
			// @ts-ignore
			const passwordHash: string = await bcrypt.hash(data.get('password'), 10);

			// Generates an ID for the parent being registered
			const parentId = uuidv4();

			// Creates an account in the database with the data from the HTML form
			const account = await createAccount({
				accountId: uuidv4(),
				username: username,
				password: passwordHash,
				isAdmin: false,
				parentId: parentId
			});

			// Creates a parent in the database with the data from the HTML form
			const parent = await createParent({
				parentId: parentId,
				accountId: account.accountId,
				dateOfBirth: data.get('dateOfBirth') as string,
				emailAddress: data.get('emailAddress') as string,
				firstName: data.get('firstName') as string,
				lastName: data.get('lastName') as string,
				houseNumber: data.get('houseNumber') as string,
				phoneNumber: data.get('phoneNumber') as string,
				postcode: data.get('postcode') as string
			});

			// Returns data so that it can be used in the HTML template
			return { success: true, parentData: parent.getData() };
		}
	}
};
