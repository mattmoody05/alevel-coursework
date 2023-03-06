import type { Actions, RequestEvent } from './$types';
import jwt from 'jsonwebtoken';
import { ADMIN_FORGOT_PASSWORD_EMAIL, JWT_SIGNING_SECRET_KEY } from '$env/static/private';
import { Mailer } from '$lib/util/email';

export const actions: Actions = {
	requestReset: async ({ request }: RequestEvent) => {
		// The token expires in an hour
		const token = jwt.sign({ admin: true }, JWT_SIGNING_SECRET_KEY, { expiresIn: '1h' });

		const mailer = new Mailer(ADMIN_FORGOT_PASSWORD_EMAIL);

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
		return { success: true };
	}
};
