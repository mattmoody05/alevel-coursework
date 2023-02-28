import { getAccount, getAdmin, Parent } from '$lib/util/newDb';
import { invalid } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { JWT_SIGNING_SECRET_KEY } from '$env/static/private';
import { doubleKeyCheck } from '$lib/util/validation';

export const load: PageServerLoad = async ({ url }: PageServerLoadEvent) => {
	if (url.searchParams.has('token')) {
		const token = url.searchParams.get('token') as string;

		return { tokenSupplied: true, tokenValid: true, token: token };
	} else {
		return { tokenSupplied: false, tokenValid: false };
	}
};

export const actions: Actions = {
	requestReset: async ({ request }: RequestEvent) => {
		const data = await request.formData();

		const emailAddress = data.get('emailAddress') as string;

		const admin = getAdmin();
		const parents = await admin.getParents();

		let matchingParent: Parent | undefined = undefined;

		for (let i = 0; i < parents.length; i++) {
			const currentParent = parents[i];
			if (currentParent.emailAddress === emailAddress) {
				matchingParent = currentParent;
			}
		}

		if (matchingParent !== undefined) {
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
			<a href="https://localhost:5173/forgot-password?token=${token}">Reset password</a>
			<br><br>
			Thank you
			`
			});
		}

		return { success: true };
	},
	resetWithToken: async ({ request }) => {
		const data = await request.formData();
		const token = data.get('token') as string;
		const password = data.get('password') as string;
		const confirmPassword = data.get('confirmPassword') as string;

		if (doubleKeyCheck(password, confirmPassword) === false) {
			return invalid(400, {
				message: 'The passwords that you have entered do not match, please ensure that they match'
			});
		}

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
				return { success: true };
			}
		}
	}
};
