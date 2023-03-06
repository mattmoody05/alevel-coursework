import { JWT_SIGNING_SECRET_KEY } from '$env/static/private';
import { getAccount, getAdmin } from '$lib/util/newDb';
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
			throw error(
				400,
				'The token that you supplied is not a valid password reset token, please try again later. '
			);
		}
	} catch {
		throw error(
			400,
			'The token that you supplied is not a valid password reset token, please try again later. '
		);
	}
};

export const actions: Actions = {
	resetWithToken: async ({ request, params }) => {
		const data = await request.formData();
		const token = params.token as string;
		const password = data.get('password') as string;
		const confirmPassword = data.get('confirmPassword') as string;

		if (doubleKeyCheck(password, confirmPassword) === false) {
			return invalid(400, {
				message: 'The passwords that you have entered do not match, please ensure that they match'
			});
		}

		const decoded = jwt.verify(token, JWT_SIGNING_SECRET_KEY) as
			| {
					admin: boolean;
			  }
			| undefined;

		if (decoded !== undefined) {
			if (decoded.admin === true) {
				const admin = getAdmin();
				await admin.setPassword(password);
				return { success: true };
			} else {
				throw error(
					400,
					'The token that you supplied is not a valid password reset token, please try again later. '
				);
			}
		} else {
			throw error(
				400,
				'The token that you supplied is not a valid password reset token, please try again later. '
			);
		}
	}
};
