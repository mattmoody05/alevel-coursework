import { getAccountId } from '$lib/util/cookies';
import { getAccount, getParent, sendMessage } from '$lib/util/db';
import type { twoWayMessage } from '$lib/util/types';
import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, request }: RequestEvent) => {
	const accountId = getAccountId(cookies);
	if (accountId !== undefined) {
		const account = await getAccount(accountId);
		if (account !== undefined) {
			const data = await request.json();
			const messageContent = data['messageContent'];
			const fromOwner = account.isAdmin;
			const parentData = await getParent(accountId, 'account');
			if (parentData !== undefined) {
				const message: twoWayMessage = await sendMessage(
					messageContent,
					parentData.parentId,
					fromOwner
				);
				return json(message);
			}
			throw error(400, 'parent with that account id could not be found');
		}
		throw error(400, 'account with that id not found');
	}
	throw error(400, 'Account id is not defined');
};
