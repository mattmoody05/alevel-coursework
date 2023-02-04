import { getParent } from '$lib/util/newDb';
import { MessageConversation } from '$lib/util/newDb';
import { error, json, redirect } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }: RequestEvent) => {
	const { isAdmin, account } = locals;
	// Checks that a parentId has been specified in the request URL
	if (url.searchParams.has('admin-parent-id')) {
		// Extracts the parentId from the request URL
		const selectedParentId = url.searchParams.get('admin-parent-id') as string;
		if (isAdmin === true) {
			// Creates a new instance of the MessageConversation class with the parentId specified in admin mode
			const messageConversation = new MessageConversation(selectedParentId, true);

			// Gets all the messages in the message conversation
			const messages = await messageConversation.getMessages();

			// Gets the parent of the current message conversation
			const parent = await messageConversation.getParent();
			if (parent !== undefined) {
				// Returns an array of messages so that the HTML template can be updated with the new messages
				return json(messages.map((message) => message.getData()));
			} else {
				// No parent was returned from the database with the specified accountId
				// 404: Not found code
				throw error(
					400,
					'The parentId specified for the two way message conversation is not valid. Please ensure the parentId that you have specified belongs to a valid parent.'
				);
			}
		} else {
			// The current user is not an admin, they do not have the rights to have conversations with other parents
			// 401: Forbidden code
			throw error(401, 'You must be an admin to have conversations with other parents');
		}
	} else if (account !== undefined) {
		// The getParent function returns an instance of the parent class for the parent who has made the request
		const parent = await getParent(account.accountId);

		if (parent !== undefined) {
			// Returns an instance of the message conversation class for the current parent in parent mode
			const messageConversation = parent.getMessageConversation();

			// Gets all the messages in the message conversation
			const messages = await messageConversation.getMessages();

			// Returns an array of messages so that the HTML template can be updated with the new messages
			return json(messages.map((message) => message.getData()));
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
};
