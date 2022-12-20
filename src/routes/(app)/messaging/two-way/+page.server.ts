import { getAccount, getMessages, getParent, sendMessage } from '$lib/util/db';
import type { parent, twoWayMessage } from '$lib/util/types';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import jwt from 'jsonwebtoken';
import { error } from '@sveltejs/kit';
import { getAccountId } from '$lib/util/cookies';

export const load: PageServerLoad = async ({ cookies }: PageServerLoadEvent) => {
	const accountId = getAccountId(cookies);
	if (accountId !== undefined) {
		const account = await getAccount(accountId);
		if (account !== undefined) {
			if (!account.isAdmin) {
				const parentData: parent | undefined = await getParent(accountId, 'account');
				if (parentData !== undefined) {
					const messages: twoWayMessage[] | undefined = await getMessages(parentData.parentId);
					if (messages !== undefined) {
						return { success: true, messages };
					}
					throw error(400, 'No messages found for that parent');
				}
				throw error(400, 'No parent found with the account id');
			}
			// do admin stuff here
			throw error(500, 'Using an admin account - this is not developed yet');
		}
	}
	throw error(400, 'Token not provided');
};

export const actions: Actions = {
	sendMessage: async ({ request, locals }: RequestEvent) => {
		const account = locals.account;
		if (account !== undefined) {
			const data = await request.formData();
			const messageContent = data.get('messageContent') as string;
			const fromOwner = account.isAdmin;
			const parentData = await getParent(account.accountId, 'account');
			if (parentData !== undefined) {
				const message: twoWayMessage = await sendMessage(
					messageContent,
					parentData.parentId,
					fromOwner
				);
				return { message };
			}
		}
		throw error(400, 'Account id is not defined');
	}
};
