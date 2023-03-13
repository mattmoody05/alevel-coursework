import { getAdmin, Parent } from '$lib/util/db';
import type { Actions, RequestEvent } from './$types';
import jwt from 'jsonwebtoken';
import { JWT_SIGNING_SECRET_KEY } from '$env/static/private';

export const actions: Actions = {
	// Handles the user submitting the form to request a password reset
	requestReset: async ({ request }: RequestEvent) => {
		const data = await request.formData();
		const emailAddress = data.get('emailAddress') as string;

		const admin = getAdmin();
		const parents = await admin.getParents();

		let matchingParent: Parent | undefined = undefined;

		// Uses a linear search to see if there is a parent which has a matching email address
		for (let i = 0; i < parents.length; i++) {
			const currentParent = parents[i];
			if (currentParent.emailAddress === emailAddress) {
				matchingParent = currentParent;
			}
		}

		if (matchingParent !== undefined) {
			// Creates a password reset token to be sent to the matching parent
			// The token expires in an hour
			const token = jwt.sign(
				{ accountId: matchingParent.accountId, emailAddress: matchingParent.emailAddress },
				JWT_SIGNING_SECRET_KEY,
				{ expiresIn: '1h' }
			);

			matchingParent.sendEmail({
				subject: 'Password reset',
				htmlBody: `
					Hi ${matchingParent.firstName},
					<br><br>
					Thank you for requesting a password reset. In order to reset your password, please click on the link below.
					<br><br>
					<a href="http://localhost:5173/forgot-password/${token}">Reset password</a>
					<br><br>
					Thank you
				`
			});
		}

		// Returns data so it can be used in the HTML template
		return { success: true };
	}
};
