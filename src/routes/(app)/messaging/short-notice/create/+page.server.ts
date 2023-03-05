import { issueShortNoticeNotification, writeShortNoticeNoitification } from '$lib/util/db';
import { getAdmin, ShortNoticeNotification, type ParentTable } from '$lib/util/newDb';
import { presenceCheck } from '$lib/util/validation';
import { error, invalid } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin } = locals;
	if (isAdmin) {
		// Gets an intance of the Admin class
		const admin = getAdmin();

		// Fetches all parents from the database
		const parents = await admin.getParents();

		// Returns data so that it can be used in the HTML template
		return { parents: parents.map((parent) => parent.getData()) };
	} else {
		// The current user is not an admin, they do not have the rights to view the page
		// 401: Forbidden code
		throw error(
			401,
			'You must be an admin to create a short notice notification. You are not able to view this page.'
		);
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to create a notification
	createNotification: async ({ request, locals }: RequestEvent) => {
		const { isAdmin } = locals;
		if (isAdmin === true) {
			// Accessing the formdata that has been submitted by the user
			const data = await request.formData();
			const message = data.get('message') as string;

			// By default, checkboxes return a string of "on" if they are in the checked state
			// Casts the string state to a boolean value
			const allParents: boolean = (data.get('allParents') as string) === 'on' ? true : false;

			// selectedParents is a hidden textbox in the interface to submit JSON data
			// Contains an array of type ParentTable
			// Parses the stringifyed JSON data to an object
			// Will only be used if allParents is false
			const selectedParentsFormElement = data.get('selectedParents') as string;
			const selectedParents: ParentTable[] = JSON.parse(selectedParentsFormElement);

			if (presenceCheck(message) === false) {
				return invalid(400, {
					message:
						'You must specify a message to issue as a short notice notification - it cannot be left blank',
					data: {
						selectedParentsFormElement,
						message,
						allParents
					}
				});
			} else if (allParents === false && selectedParents.length === 0) {
				return invalid(400, {
					message:
						'You must specify at least one parent to issue the short notice notification to, or select all parents.',
					data: {
						selectedParentsFormElement,
						message,
						allParents
					}
				});
			}

			// Creates and writes the notification data to the database
			const notification = await writeShortNoticeNoitification(message);

			const shortNoticeNotification = new ShortNoticeNotification(notification);

			await shortNoticeNotification.sendConfirmationEmail();

			// Issues the notification that has been created and written to the parents that have been specified
			await issueShortNoticeNotification(notification.notificationId, allParents, selectedParents);

			// Data is returned so that it can be part of the HTML template
			// The notification has been created and issued successfully
			return { success: true, notification };
		} else {
			// The current user is not an admin, they do not have the rights to create the notification
			// 401: Forbidden code
			throw error(
				401,
				'You must be an admin to create a short notice notification. You are not able to perform this action.'
			);
		}
	}
};
