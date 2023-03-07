import { getParent, getSession } from '$lib/util/newDb';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ params, locals }: PageServerLoadEvent) => {
	const { isAdmin, account } = locals;
	const { sessionId } = params;

	if (sessionId !== '') {
		if (isAdmin === false) {
			if (account !== undefined) {
				// Parent data is fetched from the database using the current user's accountId
				const parent = await getParent(account.accountId);
				if (parent !== undefined) {
					// Checks that the sessionId that the parent is requesting is a session that belongs to one of their children
					const parentHasAccess = await parent.hasAccessToSession(sessionId);
					if (parentHasAccess === false) {
						// The session that they have request does not belong to one of their children
						throw error(
							403,
							'The currently logged in parent does not have access to the session that is marked as absent as it belongs to another parent. Please ensure that you only specify a sessionId that belongs to you.'
						);
					}
				} else {
					// No parent was found in the database with a matching parentId
					// 500: Internal server error code
					throw error(
						500,
						"Could not get the data for the parent with the current user's accountId from the database. If an admin account is being used, please switch to a parent account."
					);
				}
			} else {
				// No user is currently logged in
				// User is redirected to the login page
				// 308: Permanent redirect code
				throw redirect(308, '/login');
			}
		}

		// This will only run if either the parent has access to the session, or if the current user is an admin

		// Fetches the session from the databse
		const absentSession = await getSession(params.sessionId);
		if (absentSession !== undefined) {
			const childData = await absentSession.getChild();
			if (childData !== undefined) {
				return { sessionData: absentSession.getData(), childData: childData.getData() };
			} else {
				// No child was found with the specified childId
				// 500: Internal server error code
				throw error(
					500,
					"There was an error getting the child's data associated with this absence report."
				);
			}
		} else {
			// No session was found with the specified sessionId
			// 404: Not found code
			throw error(
				404,
				'An absence report with that sessionId could not be found. Please make sure that the sessionId input is a valid one.'
			);
		}
	} else {
		// The user did not specifiy a sessionId for the absence they want to view
		// 400: Bad request code
		throw error(
			400,
			'A sessionId was not provided to view the absence report. Please make sure a sessionId is provided in the URL.'
		);
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to update an absence report
	updateReport: async ({ request, locals, params }: RequestEvent) => {
		const { isAdmin } = locals;
		if (isAdmin === true) {
			// Accessing the formdata that has been submitted by the user
			const data = await request.formData();
			const sessionId = params.sessionId;
			const keepSession: boolean = (data.get('keepSessions') as string) === 'on';
			const chargeSession: boolean = (data.get('chargeSessions') as string) === 'on';

			const session = await getSession(sessionId);
			if (session !== undefined) {
				await session.updateAbsenceStatus(chargeSession, keepSession);

				// Data is returned so that it can be part of the HTML template
				// The session was updated successfully
				return { success: true };
			} else {
				throw error(
					404,
					'The session for this absence report could not be found, please ensure that you have specified a valid sessionId'
				);
			}
		} else {
			// The current user is not an admin
			// 403: Forbidden code
			throw error(403, 'You must be using and admin account to update an absence report.');
		}
	}
};
