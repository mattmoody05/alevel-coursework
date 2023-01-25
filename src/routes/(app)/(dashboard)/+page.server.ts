import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
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
	const { account, isAdmin } = locals;

	if (account !== undefined) {
		if (isAdmin === true) {
			// An admin is the currently logged in user
			// Data in realation to all parents is fetched from the database

			// Session, child, notification data is fetched from the database
			const sessions = await getAllSessions();
			const children = await getAllChildren();
			const notifications = await getAllShortNoticeNotifications();

			// Data is returned so that it can be used as part of the HTML template
			return {
				sessions,
				children,
				notifications,
				isAdmin
			};
		} else {
			// A parent is the currently logged in user
			// Data in realation to the current parent only is fetched from the database

			// Parent data is fetched from the database using the current user's accountId
			const parentData = await getParent(account.accountId, 'account');
			if (parentData !== undefined) {
				// Session, child, notification data is fetched from the database using the current parentId
				const sessions = await getAllParentSessions(parentData.parentId);
				const children = await getChildren(parentData.parentId);
				const notifications = await getShortNoticeNotifications(parentData.parentId);

				// Data is returned so that it can be used as part of the HTML template
				return {
					parentData,
					sessions,
					children,
					notifications,
					isAdmin
				};
			} else {
				// No parent was found in the database with a matching parentId
				// 500: Internal server error code
				throw error(
					500,
					"Could not get the data for the parent with the current user's accountId from the database. If an admin account is being used, please switch to a parent account."
				);
			}
		}
	} else {
		// No user is currently logged in
		// User is redirected to the login page
		// 308: Permanent redirect code
		throw redirect(308, '/login');
	}
};
