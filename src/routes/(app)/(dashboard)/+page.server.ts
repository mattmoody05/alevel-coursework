import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import type { child, parent, session } from '$lib/util/types';
import { getChildren, getParent, getAllParentSessions } from '$lib/util/db';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const account = locals.account;
	if (account !== undefined) {
		const parentData: parent | undefined = await getParent(account.accountId, 'account');
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
	throw redirect(300, '/login');
};
