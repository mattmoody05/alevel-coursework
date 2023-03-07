import { getAdmin, getChild, getParent, RecurringSessionRequest, type Child } from '$lib/util/db';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin, account } = locals;

	let children: Child[] = [];

	if (isAdmin === true) {
		// Returns an instance of the admin class
		const admin = getAdmin();

		// Gets all the children in the database
		children = await admin.getChildren();
	} else {
		if (account !== undefined) {
			// Returns an instance of the parent class
			const parent = await getParent(account.accountId);
			if (parent !== undefined) {
				// Returns all children belonging to the currently logged in parent
				children = await parent.getChildren();
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
	let requests: RecurringSessionRequest[] = [];
	for (let i = 0; i < children.length; i++) {
		const currentChild: Child = children[i];

		// Gets the recurring session request belonging to the current child
		// If the child has a request, it is added to the array of recurring session requests
		const recurringSessionRequestData = await currentChild.getRecurringSessionRequest();
		if (recurringSessionRequestData !== undefined) {
			requests = [...requests, recurringSessionRequestData];
		}
	}

	if (isAdmin === true) {
		// Returns an instance of the admin class
		const admin = getAdmin();

		// Gets all the parents in the database
		const parents = await admin.getParents();

		// Returns data so that it can be used in the HTML template
		return {
			children: children.map((child) => child.getData()),
			recurringSessionRequests: requests.map((request) => request.getData()),
			parents: parents.map((parent) => parent.getData())
		};
	} else {
		// Returns data so that it can be used in the HTML template
		return {
			children: children.map((child) => child.getData()),
			recurringSessionRequests: requests.map((request) => request.getData())
		};
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to cnacel a recurring session
	parentCancel: async ({ request }: RequestEvent) => {
		// Retrieves the data form the HTML form
		const data = await request.formData();
		const childId = data.get('childId') as string;

		// Returns an instance of the child class
		const child = await getChild(childId);

		if (child !== undefined) {
			// Deletes the select child's recurring session request
			await child.deleteRecurringSessionRequest();

			// Returns data so that it can be used in the HTML template
			return { success: true, action: 'parentCancel' };
		} else {
			// No child was found in the database
			// 404: Not found code
			throw error(
				404,
				'A child with that childId could not be found within the database, please ensure that you have selected a child. '
			);
		}
	},

	// Handles the user submitting the form to approve a recurring session
	// Admin only action
	adminApprove: async ({ request, locals }: RequestEvent) => {
		const { isAdmin } = locals;
		if (isAdmin === true) {
			// Retrieves the data form the HTML form
			const data = await request.formData();
			const childId = data.get('childId') as string;
			const reason = data.get('decision-reason') as string;

			// Returns an instance of the child class
			const child = await getChild(childId);

			if (child !== undefined) {
				const request = await child.getRecurringSessionRequest();

				if (request !== undefined) {
					await request.sendConfirmationEmail('approve');
				} else {
					throw error(404, 'A recurring session for the child could not be found. ');
				}

				// Sets the recurring session request's status field

				// Creates the sessions specified in the recurring session request
				const recurringSessionBookingStatus = await child.createRecurringSession();
				if (recurringSessionBookingStatus === undefined) {
					throw error(500, 'there was an issue when booking the recurring session');
				} else if (recurringSessionBookingStatus.success === true) {
					await child.setRecurringSessionRequestStatus(true, reason);
					return { success: true, action: 'adminApprove' };
				} else if (recurringSessionBookingStatus.success === false) {
					return {
						action: 'adminApprove',
						success: false,
						clashingSessions: recurringSessionBookingStatus.clashes.map((session) =>
							session.getData()
						),
						childId: childId
					};
				}
			} else {
				// No child was found in the database
				// 404: Not found code
				throw error(
					404,
					'A child with that childId could not be found within the database, please ensure that you have selected a child. '
				);
			}
		} else {
			// User is not an admin
			// 403: Forbidden code
			throw error(
				403,
				'You must be an admin to approve a recurring session request, please ensure that you are using an admin account.'
			);
		}
	},

	// Handles the user submitting the form to deline a recurring session request
	// Admin only action
	adminDecline: async ({ request, locals }: RequestEvent) => {
		const { isAdmin } = locals;
		if (isAdmin === true) {
			// Retrieves the data form the HTML form
			const data = await request.formData();
			const childId = data.get('childId') as string;
			const reason = data.get('decision-reason') as string;

			// Returns an instance of the child class
			const child = await getChild(childId);

			if (child !== undefined) {
				const request = await child.getRecurringSessionRequest();

				if (request !== undefined) {
					await request.sendConfirmationEmail('decline');
				} else {
					throw error(404, 'A recurring session for the child could not be found. ');
				}

				// Sets the recurring session request's status field
				await child.setRecurringSessionRequestStatus(false, reason);

				// Returns data so that it can be used in the HTML template
				return { success: true, action: 'adminDecline' };
			} else {
				// No child was found in the database
				// 404: Not found code
				throw error(
					404,
					'A child with that childId could not be found within the database, please ensure that you have selected a child. '
				);
			}
		} else {
			// User is not an admin
			// 403: Forbidden code
			throw error(
				403,
				'You must be an admin to decline a recurring session request, please ensure that you are using an admin account.'
			);
		}
	},
	approveAnyway: async ({ request }: RequestEvent) => {
		const data = await request.formData();

		const childId = (await data.get('childId')) as string;

		const child = await getChild(childId);

		if (child !== undefined) {
			await child.createRecurringSession(true);
			await child.setRecurringSessionRequestStatus(true, '');
		}
		return { success: true, action: 'approveAnyway' };
	}
};
