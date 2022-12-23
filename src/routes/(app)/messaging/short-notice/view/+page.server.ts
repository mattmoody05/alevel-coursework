import {
	getAllShortNoticeNotifications,
	getParent,
	getShortNoticeNotifications
} from '$lib/util/db';
import type { parent, shortNoticeNotifcation } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin, account } = locals;
	if (account !== undefined) {
		if (isAdmin) {
			const notifications = await getAllShortNoticeNotifications();
			if (notifications !== undefined) {
				return { notifications };
			}
			throw error(500, 'notifications undefined');
		} else {
		}
		const parentData: parent | undefined = await getParent(account.accountId, 'account');
		if (parentData !== undefined) {
			const notifications: shortNoticeNotifcation[] | undefined = await getShortNoticeNotifications(
				parentData.parentId
			);
			if (notifications !== undefined) {
				return { notifications };
			}
			throw error(400, 'notifications undefined');
		}
		throw error(400, 'parent data undefined');
	}
	throw error(400, 'account undefined');
};
