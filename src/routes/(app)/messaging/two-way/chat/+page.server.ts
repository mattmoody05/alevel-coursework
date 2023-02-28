import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from '../$types';
import { error, invalid, redirect } from '@sveltejs/kit';
import { MessageConversation, getParent } from '$lib/util/newDb';
import { presenceCheck } from '$lib/util/validation';

export const load: PageServerLoad = async ({ locals, url }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;

	// Checks that the URL has the search paramater
	// Search parameter is used by admin accounts to select which parent they are chatting with
	if (url.searchParams.has('admin-parent-id')) {
		// Gets the current parentId from the URL search params
		const selectedParentId = url.searchParams.get('admin-parent-id') as string;
		if (isAdmin) {
			// Creates a new instance of the message conversation class
			const messageConversation = new MessageConversation(selectedParentId, true);

			// Fetches all the messages from the conversation, and the parent's data for that conversation
			const messages = await messageConversation.getMessages();
			const parent = await messageConversation.getParent();

			if (parent !== undefined) {
				// Returns data so that it can be used in the HTML template
				return {
					messages: messages.map((message) => message.getData()),
					isAdmin,
					parentId: selectedParentId,
					chattingWith: parent.firstName
				};
			} else {
				// No parent was returned from the database with the specified accountId
				// 404: Not found code
				throw error(
					404,
					'We could not find a parent associated with that account. Please make sure that you are not using an admin account. '
				);
			}
		} else {
			// The current user is not an admin, they do not have the rights to have conversations with other parents
			// 401: Forbidden code
			throw error(401, 'You must be an admin to have conversations with other parents');
		}
	} else if (account !== undefined) {
		// Returns an instance of the parent class
		const parent = await getParent(account.accountId);
		if (parent !== undefined) {
			// Gets an instance of the message conversation class for the parent
			const messageConversation = parent.getMessageConversation();

			// Gets the messages in the message conversation
			const messages = await messageConversation.getMessages();

			// Returns data so that it can be used in the HTML template
			return {
				messages: messages.map((message) => message.getData()),
				isAdmin,
				parentId: parent.parentId,
				chattingWith: 'Admin'
			};
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

export const actions: Actions = {
	// Handles the user submitting the form to send a message
	// Cannot have a named action - uses query paramaters which interferes with admin-parent-id param
	default: async ({ request, locals, url }: RequestEvent) => {
		const { account, isAdmin } = locals;
		if (isAdmin === true) {
			// Checks that the URL has the search paramater
			// Search parameter is used by admin accounts to select which parent they are chatting with
			if (url.searchParams.has('admin-parent-id')) {
				// Gets the current parentId from the URL search params
				const selectedParentId = url.searchParams.get('admin-parent-id') as string;

				// Retrieves the data that has been submitted in the form
				const data = await request.formData();
				const messageContent = data.get('messageContent') as string;

				if (presenceCheck(messageContent) === false) {
					return invalid(400, {
						validationMessage:
							'You must specify a two way message to send - it cannot be left blank',
						data: {}
					});
				}

				// Creates a new message conversation for the selected parent
				const messageConversation = new MessageConversation(selectedParentId, true);

				// Sends the message, with the message content submitted in the form
				const message = await messageConversation.sendMessage(messageContent);

				// Returns data so that it can be used in the HTML template
				return { message: message.getData() };
			}
		} else {
			if (account !== undefined) {
				// Retrieves the data that has been submitted in the form
				const data = await request.formData();
				const messageContent = data.get('messageContent') as string;

				if (presenceCheck(messageContent) === false) {
					return invalid(400, {
						validationMessage:
							'You must specify a two way message to send - it cannot be left blank',
						data: {}
					});
				}

				// Returns an instance of the parent class
				const parent = await getParent(account.accountId);

				if (parent !== undefined) {
					// Returns an instance of the message conversation class
					const messageConversation = parent.getMessageConversation();

					// Sends the message, with the message content submitted in the form
					const message = await messageConversation.sendMessage(messageContent);

					// Returns data so that it can be used in the HTML template
					return { message: message.getData() };
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
	}
};
