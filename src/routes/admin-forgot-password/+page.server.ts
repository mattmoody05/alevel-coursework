import type { Actions, RequestEvent } from './$types';
import jwt from 'jsonwebtoken';
import { ADMIN_FORGOT_PASSWORD_EMAIL, JWT_SIGNING_SECRET_KEY } from '$env/static/private';
import { Mailer } from '$lib/util/email';

export const actions: Actions = {
	requestReset: async ({}: RequestEvent) => {
		// The token expires in an hour
		// Generates an admin only password reset token
		const token = jwt.sign({ admin: true }, JWT_SIGNING_SECRET_KEY, { expiresIn: '1h' });

		// Mailer object for the admin's email
		const mailer = new Mailer(ADMIN_FORGOT_PASSWORD_EMAIL);

		// Sends an email to the admin with the token
		mailer.sendEmail({
			subject: 'Admin password reset',
			htmlBody: `
			Hi Admin!,
<br><br>
			Thank you for requesting a password reset. In order to reset your password, please click on the link below.
			<br><br>
			<a href="http://localhost:5173/admin-forgot-password/${token}">Reset password</a>
			<br><br>
			Thank you
			`
		});

		// Returns data so it can be used in the HTML template
		return { success: true };
	}
};
