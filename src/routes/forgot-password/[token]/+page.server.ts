import { JWT_SIGNING_SECRET_KEY } from '$env/static/private';
import { getAccount } from '$lib/util/db';
import { doubleKeyCheck } from '$lib/util/validation';
import { error, invalid, type Actions } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const token = params.token as string;
	try {
		const decoded = jwt.verify(token, JWT_SIGNING_SECRET_KEY) as
			| {
					accountId: string;
					emailAddress: string;
			  }
			| undefined;
		if (decoded !== undefined) {
			return;
		} else {
			// Token does not include the required fields
			// The token provided is not valid so cannot be used to reset the password
			// 400: Bad request code
			throw error(
				400,
				'The token that you supplied is not a valid password reset token, please try again later. '
			);
		}
	} catch {
		// Token could not be decoded or has expired
		// The token provided is not valid so cannot be used to reset the password
		// 400: Bad request code
		throw error(
			400,
			'The token that you supplied is not a valid password reset token, please try again later or request another token. '
		);
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to enter their new password with the token
	resetWithToken: async ({ request, params }) => {
		const token = params.token as string;

		// Extracts the submitted data from the HTML form
		const data = await request.formData();
		const password = data.get('password') as string;
		const confirmPassword = data.get('confirmPassword') as string;

		if (doubleKeyCheck(password, confirmPassword) === false) {
			return invalid(400, {
				message: 'The passwords that you have entered do not match, please ensure that they match'
			});
		}

		try {
			const decoded = jwt.verify(token, JWT_SIGNING_SECRET_KEY) as
				| {
						accountId: string;
						emailAddress: string;
				  }
				| undefined;
			if (decoded !== undefined) {
				const account = await getAccount(decoded.accountId);

				if (account !== undefined) {
					await account.updatePassword(password);

					// Returns data so it can be used in the HTML template
					return { success: true };
				}
			} else {
				// Token does not include the required fields
				// The token provided is not valid so cannot be used to reset the password
				// 400: Bad request code
				throw error(
					400,
					'The token that you supplied is not a valid password reset token, please try again later. '
				);
			}
		} catch {
			// Token could not be decoded or has expired
			// The token provided is not valid so cannot be used to reset the password
			// 400: Bad request code
			throw error(
				400,
				'The token that you supplied is not a valid password reset token, please try again later or request another token. '
			);
		}
	}
};
