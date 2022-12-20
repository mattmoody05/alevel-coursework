import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import type { child, parent, session } from '$lib/util/types';
import {
	getChildren,
	getParent,
	getAllParentSessions,
	getAllSessions,
	getAllChildren
} from '$lib/util/db';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const account = locals.account;
	const isAdmin = locals.isAdmin;
	if (account !== undefined) {
		if (isAdmin) {
			const sessions = await getAllSessions();
			if (sessions !== undefined) {
				const children = await getAllChildren();
				if (children !== undefined) {
					return {
						sessions,
						children,
						isAdmin
					};
				}
				throw error(500, 'children not defined');
			}
			throw error(500, 'sessions not defined');
		}
		const parentData: parent | undefined = await getParent(account.accountId, 'account');
		if (parentData !== undefined) {
			const sessions: session[] | undefined = await getAllParentSessions(parentData.parentId);
			if (sessions !== undefined) {
				const children: child[] | undefined = await getChildren(parentData.parentId);
				if (children !== undefined) {
					return {
						parentData,
						sessions,
						children,
						isAdmin
					};
				}
			}
			throw error(400, 'sessions undefined');
		}
		throw error(400, 'parentData undefined');
	}
	throw redirect(300, '/login');
};
