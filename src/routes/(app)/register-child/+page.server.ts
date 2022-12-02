import { getChild, getParent } from '$lib/util/db';
import type { parent } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types';
import { openDb } from '../../../db/index';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

export const actions: Actions = {
	default: async ({ request, cookies }: RequestEvent) => {
		const data = await request.formData();
		const token: string | undefined = cookies.get('token');
		if (token !== undefined) {
			// Cannot be sure that the accountId is provided as part of JWT, ts-ignore used for time being, needs to be fixed
			// @ts-ignore
			const jwtPayload: { accountId: string } = jwt.decode(token);
			const accountId = jwtPayload['accountId'];

			const parentData: parent | undefined = await getParent(accountId, 'account');
			console.log(accountId);

			console.log(parentData);

			if (parentData !== undefined) {
				const db = await openDb();
				const childId: string = uuidv4();
				await db.run(
					'INSERT INTO child VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
					childId,
					data.get('firstName'),
					data.get('lastName'),
					data.get('dateOfBirth'),
					data.get('educationName'),
					data.get('educationType'),
					data.get('additionalNeedDetails'),
					data.get('additionalNeedType'),
					parentData.parentId
				);
				const childData = await getChild(childId);
				return { success: true, childData };
			}
			throw error(400, 'Parent not associated with that account id');
		}
		throw error(400, 'Must be logged in');
	}
};
