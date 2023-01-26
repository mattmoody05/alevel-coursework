import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { getAdmin, getParent } from '$lib/util/newDb';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;

	if (account !== undefined) {
		if (isAdmin === true) {
			// An admin is the currently logged in user
			// Data in realation to all parents is fetched from the database

			// getAdmin returns an instance of the admin class
			const admin = getAdmin(account.accountId);

			// Session, child, notification data is fetched from the database
			const sessions = await admin.getSessions();
			const children = await admin.getChildren();
			const notifications = await admin.getNotifications();

			// Data is returned so that it can be used as part of the HTML template
			return {
				sessions: sessions.map((session) => session.getData()),
				children: children.map((child) => child.getData()),
				notifications: notifications.map((notification) => notification.getData()),
				isAdmin
			};
		} else {
			// A parent is the currently logged in user
			// Data in realation to the current parent only is fetched from the database

			// getParent should return an instance of the parent class
			// If no parent is found with the specified accountId, undefined is returned
			const parent = await getParent(account.accountId);
			if (parent !== undefined) {
				// Session, child, notification data is fetched from the database using the parent object
				const sessions = await parent.getSessions();
				const children = await parent.getChildren();
				const notifications = await parent.getNotifications();

				// Data is returned so that it can be used as part of the HTML template
				return {
					parentData: parent.getData(),
					sessions: sessions.map((session) => session.getData()),
					children: children.map((child) => child.getData()),
					notifications: notifications.map((notification) => notification.getData()),
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
