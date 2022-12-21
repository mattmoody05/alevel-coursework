import { getMessages, getParent } from '$lib/util/db';
import type { twoWayMessage, parent } from '$lib/util/types';
import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, request, url }: RequestEvent) => {
	const { isAdmin, account } = locals;
	if (url.searchParams.has('admin-parent-id')) {
		const selectedParentId = url.searchParams.get('admin-parent-id') as string;
		if (isAdmin) {
			const messages: twoWayMessage[] | undefined = await getMessages(selectedParentId);
			if (messages !== undefined) {
				return json(messages);
			}
			throw error(400, 'No messages found for that parent');
		}
	} else if (account !== undefined) {
		const parentData: parent | undefined = await getParent(account.accountId, 'account');
		if (parentData !== undefined) {
			const messages: twoWayMessage[] | undefined = await getMessages(parentData.parentId);
			if (messages !== undefined) {
				return json(messages);
			}
			throw error(400, 'No messages found for that parent');
		}
		throw error(400, 'No parent found with the account id');
	}
	throw error(400, 'account not defined');
};
