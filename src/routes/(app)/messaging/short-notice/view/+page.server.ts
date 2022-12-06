import { getAccountId } from '$lib/util/cookies';
import { getParent, getShortNoticeNotifications } from '$lib/util/db';
import type { parent, shortNoticeNotifcation } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ cookies }: PageServerLoadEvent) => {
	const accountId = await getAccountId(cookies);
	if (accountId !== undefined) {
		const parentData: parent | undefined = await getParent(accountId, 'account');
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
	throw error(400, 'account id undefined');
};
