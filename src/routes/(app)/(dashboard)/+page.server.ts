import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import type { child, parent, session, shortNoticeNotifcation } from '$lib/util/types';
import {
	getChildren,
	getParent,
	getAllParentSessions,
	getAllSessions,
	getAllChildren,
	getShortNoticeNotifications,
	getAllShortNoticeNotifications
} from '$lib/util/db';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const account = locals.account;
	const isAdmin = locals.isAdmin;
	if (account !== undefined) {
		// admin stuff
		if (isAdmin) {
			const sessions = await getAllSessions();
			if (sessions !== undefined) {
				const children = await getAllChildren();
				if (children !== undefined) {
					const notifications = await getAllShortNoticeNotifications();
					if (notifications !== undefined) {
						return {
							sessions,
							children,
							notifications,
							isAdmin
						};
					}
					throw error(500, 'notifications undefined');
				}
				throw error(500, 'children not defined');
			}
			throw error(500, 'sessions not defined');
		}

		// parent account stuff
		const parentData: parent | undefined = await getParent(account.accountId, 'account');
		if (parentData !== undefined) {
			const sessions: session[] | undefined = await getAllParentSessions(parentData.parentId);
			if (sessions !== undefined) {
				const children: child[] | undefined = await getChildren(parentData.parentId);
				if (children !== undefined) {
					const notifications = await getShortNoticeNotifications(parentData.parentId);
					if (notifications !== undefined) {
						return {
							parentData,
							sessions,
							children,
							notifications,
							isAdmin
						};
					}
					throw error(500, 'notifications undefined');
				}
				throw error(500, 'children undefined');
			}
			throw error(400, 'sessions undefined');
		}
		throw error(400, 'parentData undefined');
	}
	throw redirect(300, '/login');
};
