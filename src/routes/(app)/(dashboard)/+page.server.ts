import { error, redirect } from '@sveltejs/kit';
import { openDb } from '../../../db/index';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import jwt from 'jsonwebtoken';
import type { parent } from '$lib/util/types';

export const load: PageServerLoad = async ({ cookies }: PageServerLoadEvent) => {
	const token: string | undefined = cookies.get('token');
	if (token !== undefined) {
		// Cannot be sure that the accountId is provided as part of JWT, ts-ignore used for time being, needs to be fixed
		// @ts-ignore
		const jwtPayload: { accountId: string } = jwt.decode(token);
		const accountId = jwtPayload['accountId'];

		const db = await openDb();

		const parentData: parent | undefined = await db.get(
			'SELECT * FROM parent WHERE accountId = ?',
			accountId
		);

		if (parentData !== undefined) {
			return {
				parentData
			};
		}

		// Account with the provided id could not be found in db
		throw error(400, 'Parent with that account ID could not be found');
	}
	// Token cookie has not been provided - they need to login to access page
	throw redirect(302, '/login');
};
