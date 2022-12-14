import { error, redirect } from '@sveltejs/kit';
import { openDb } from '../../../db/index';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import jwt from 'jsonwebtoken';
import type { child, parent, session } from '$lib/util/types';
import {
	getChildren,
	getChildSessions,
	getParent,
	getSession,
	getAllParentSessions
} from '$lib/util/db';
import { getAccountId } from '$lib/util/cookies';

export const load: PageServerLoad = async ({ cookies }: PageServerLoadEvent) => {
	const token: string | undefined = cookies.get('token');
	if (token !== undefined) {
		const accountId = getAccountId(cookies);
		if (accountId !== undefined) {
			const parentData: parent | undefined = await getParent(accountId, 'account');
			if (parentData !== undefined) {
				const sessions: session[] | undefined = await getAllParentSessions(parentData.parentId);
				if (sessions !== undefined) {
					const children: child[] | undefined = await getChildren(parentData.parentId);
					if (children !== undefined) {
						return {
							parentData,
							sessions,
							children
						};
					}
				}
				throw error(400, 'sessions undefined');
			}
			throw error(400, 'parentData undefined');
		}

		// Account with the provided id could not be found in db
		throw error(400, 'account id undefined');
	}
	// Token cookie has not been provided - they need to login to access page
	throw redirect(302, '/login');
};
