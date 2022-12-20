import { getChild, getParent } from '$lib/util/db';
import type { parent } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types';
import { openDb } from '../../../db/index';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

export const actions: Actions = {
	default: async ({ request, locals }: RequestEvent) => {
		const data = await request.formData();
		const account = locals.account;
		if (account !== undefined) {
			const parentData: parent | undefined = await getParent(account.accountId, 'account');

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
			throw error(400, 'Parent not associated with that account');
		}
		throw error(400, 'Account undefined');
	}
};
