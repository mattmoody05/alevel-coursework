import { getChildren, getParent, createAbsenceReport } from '$lib/util/db';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { error, invalid, redirect } from '@sveltejs/kit';
import { presenceCheck, validateDate } from '$lib/util/validation';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { account } = locals;
	if (account !== undefined) {
		// Parent data is fetched from the database using the current user's accountId
		const parentData = await getParent(account.accountId, 'account');
		if (parentData !== undefined) {
			// Child data is fetched from the database using the current parentId
			const children = await getChildren(parentData.parentId);

			// Data is returned so that it can be used as part of the HTML template
			return { children };
		}
		// No parent was found in the database with a matching parentId
		// 500: Internal server error code
		throw error(
			500,
			'Could not get the data for the parent with the current accountId from the database. If an admin account is being used, please switch to a parent account.'
		);
	} else {
		// No user is currently logged in
		// User is redirected to the login page
		// 308: Permanent redirect code
		throw redirect(308, '/login');
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to create an absence report
	createReport: async ({ request }: RequestEvent) => {
		// Accessing the formdata that has been submitted by the user
		const data = await request.formData();
		const childId = data.get('childId') as string;
		const startDate = data.get('startDate') as string;
		const endDate = data.get('endDate') as string;
		const reason = data.get('reason') as string;
		const additionalInformation = data.get('additionalInformation') as string;

		if (validateDate(startDate) === false) {
			return invalid(400, {
				message:
					'You have not input a valid start date, please ensure it follows the DD/MM/YYYY format',
				data: {
					startDate,
					endDate,
					reason,
					additionalInformation
				}
			});
		} else if (validateDate(endDate) === false) {
			return invalid(400, {
				message:
					'You have not input a valid end date, please ensure it follows the DD/MM/YYYY format',
				data: {
					startDate,
					endDate,
					reason,
					additionalInformation
				}
			});
		} else if (presenceCheck(reason) === false) {
			return invalid(400, {
				message: 'You have not entered a reason, please specify one as it cannot be left blank',
				data: {
					startDate,
					endDate,
					reason,
					additionalInformation
				}
			});
		}

		// Writing the absence report to the database
		const sessionsMarkedAsAbsent = await createAbsenceReport(
			childId,
			startDate,
			endDate,
			reason,
			additionalInformation
		);

		// Data is returned so that it can be part of the HTML template
		// The number of sessions that have been marked as absent is returned so that it can be displayed in the interface
		return { success: true, sessionsMarkedAsAbsent };
	}
};
