import { getAdmin, ShortNoticeNotification } from '$lib/util/newDb';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { getParent } from '$lib/util/newDb';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin, account } = locals;

	let notifications: ShortNoticeNotification[] = [];

	if (isAdmin === true) {
		// Returns an instance of the Admin class
		const admin = getAdmin();

		// Fetches all notifications from the database
		notifications = await admin.getNotifications();
	} else {
		if (account !== undefined) {
			// Returns an instance of the parent class
			const parent = await getParent(account.accountId);
			if (parent !== undefined) {
				// Fetches all the notifications that have been issued to the current parent
				notifications = await parent.getNotifications();
			} else {
				// No parent was returned from the database with the specified accountId
				// 404: Not found code
				throw error(
					404,
					'We could not find a parent associated with that account. Please make sure that you are not using an admin account. '
				);
			}
		} else {
			// No user is currently logged in
			// User is redirected to the login page
			// 308: Permanent redirect code
			throw redirect(308, '/login');
		}
	}

	return {
		notifications: notifications.map((notification) => notification.getData())
	};
};
