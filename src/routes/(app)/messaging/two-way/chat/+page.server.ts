import { getMessages, getParent, sendMessage } from '$lib/util/db';
import type { parent, twoWayMessage } from '$lib/util/types';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from '../$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;

	if (url.searchParams.has('admin-parent-id')) {
		const selectedParentId = url.searchParams.get('admin-parent-id') as string;
		if (isAdmin) {
			const messages: twoWayMessage[] | undefined = await getMessages(selectedParentId);
			if (messages !== undefined) {
				const parentData = await getParent(selectedParentId, 'parent');
				if (parentData !== undefined) {
					return {
						success: true,
						messages,
						isAdmin,
						parentId: selectedParentId,
						chattingWith: parentData.firstName
					};
				}
				throw error(400, 'parent data undefined');
			}
			throw error(400, 'No messages found for that parent');
		}
	} else if (account !== undefined) {
		const parentData: parent | undefined = await getParent(account.accountId, 'account');
		if (parentData !== undefined) {
			const messages: twoWayMessage[] | undefined = await getMessages(parentData.parentId);
			if (messages !== undefined) {
				return {
					success: true,
					messages,
					isAdmin,
					parentId: parentData.parentId,
					chattingWith: 'Admin'
				};
			}
			throw error(400, 'No messages found for that parent');
		}
		throw error(400, 'No parent found with the account id');
	}
	throw error(400, 'account not defined');
};

export const actions: Actions = {
	default: async ({ request, locals, url }: RequestEvent) => {
		const { account, isAdmin } = locals;
		if (isAdmin) {
			if (url.searchParams.has('admin-parent-id')) {
				const selectedParentId = url.searchParams.get('admin-parent-id') as string;
				const data = await request.formData();
				const messageContent = data.get('messageContent') as string;
				const fromOwner = isAdmin;
				const message: twoWayMessage = await sendMessage(
					messageContent,
					selectedParentId,
					fromOwner
				);
				return { message };
			}
		} else {
			if (account !== undefined) {
				const data = await request.formData();
				const messageContent = data.get('messageContent') as string;
				const fromOwner = isAdmin;
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
	}
};
