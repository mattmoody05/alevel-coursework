import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { getAdmin, type ParentTable, type TwoWayMessageTable } from '$lib/util/db';
import { getParent } from '$lib/util/db';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;
	if (isAdmin === true) {
		let latestMessages: { parent: ParentTable; latestMessage: TwoWayMessageTable | undefined }[] =
			[];

		// Returns an instance of the admin class
		const admin = getAdmin();

		// Fetches all parents from the database
		const parents = await admin.getParents();

		for (let i = 0; i < parents.length; i++) {
			const currentParent = parents[i];

			// Gets the latest message for each parent
			const messageConversation = currentParent.getMessageConversation();
			const latestMessage = await messageConversation.getLatestMessage();

			if (latestMessage !== undefined) {
				latestMessages = [
					...latestMessages,
					{ parent: currentParent.getData(), latestMessage: latestMessage.getData() }
				];
			} else {
				latestMessages = [
					...latestMessages,
					{ parent: currentParent.getData(), latestMessage: undefined }
				];
			}
		}

		// Returns data so that it can be used in the HTML template
		return { isAdmin, latestMessages };
	} else {
		if (account !== undefined) {
			// Returns an instance of the parent class
			const parent = await getParent(account.accountId);
			if (parent !== undefined) {
				// Gets the latest message for the current parent
				const messageConversation = parent.getMessageConversation();
				const latestMessage = await messageConversation.getLatestMessage();

				// Returns data so that it can be used in the HTML template
				// Classes cannot be returned to the template so the getData method is called to return JSON data
				return { isAdmin, latestMessage: latestMessage?.getData() };
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
};
