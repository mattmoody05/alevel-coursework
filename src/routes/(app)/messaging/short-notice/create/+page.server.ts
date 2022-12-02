import { getAccountId } from '$lib/util/cookies';
import {
	getAccount,
	getAllParents,
	issueShortNoticeNotification,
	writeShortNoticeNoitification
} from '$lib/util/db';
import type { account, parent } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ cookies, request }: PageServerLoadEvent) => {
	const accountId = getAccountId(cookies);
	if (accountId !== undefined) {
		const accountData: account | undefined = await getAccount(accountId);
		if (accountData !== undefined) {
			if (accountData.isAdmin) {
				const parents: parent[] = await getAllParents();
				return { parents };
			}
			throw error(400, 'page can only be accessed as an admin');
		}
		throw error(400, 'account with that id not found');
	}
	throw error(400, 'account id not defined');
};

export const actions: Actions = {
	default: async ({ request, cookies }: RequestEvent) => {
		const accountId = getAccountId(cookies);
		if (accountId !== undefined) {
			const accountData: account | undefined = await getAccount(accountId);
			if (accountData !== undefined) {
				if (accountData.isAdmin) {
					console.log(accountData.isAdmin);

					const data = await request.formData();

					// gets the data from the form fields
					const allParentsCheckbox = data.get('allParents') as string; // returns "on" if checked, or null if not
					const message = data.get('message') as string;
					const selectedParentsFormElement = data.get('selectedParents') as string;

					// casts data from form
					const allParents: boolean = allParentsCheckbox === 'on' ? true : false;
					const selectedParents: parent[] = JSON.parse(selectedParentsFormElement);

					// writes notification to db
					const notification = await writeShortNoticeNoitification(message);

					// issues notification to parents
					await issueShortNoticeNotification(
						notification.notificationId,
						allParents,
						selectedParents
					);
					return { success: true, notification };
				}

				throw error(400, 'page can only be accessed as an admin');
			}
			throw error(400, 'account with that id not found');
		}
		throw error(400, 'account id not defined');
	}
};
