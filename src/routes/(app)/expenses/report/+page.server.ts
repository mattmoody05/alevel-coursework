import { createExpense } from '$lib/util/db';
import { error, type Actions } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export const actions: Actions = {
	// Handles the user submitting the form to create an expense report
	createReport: async ({ request, locals }: RequestEvent) => {
		const { isAdmin } = locals;
		if (isAdmin === true) {
			// Accessing the formdata that has been submitted by the user
			const data = await request.formData();
			const expenseName = data.get('expenseName') as string;
			const date = data.get('date') as string;
			const cost = Number(data.get('cost') as string) * 100;
			const type = data.get('type') as string;
			const supportingDocsPath = data.get('supportingDocsPath') as string;

			// By default, checkboxes return a string of "on" if they are in the checked state
			// Casts the string state to a boolean value
			const chargeToParents = (data.get('chargeParents') as string) === 'on' ? true : false;

			// Creates the expense report in the database
			const createdExpense = await createExpense(
				expenseName,
				date,
				cost,
				type,
				chargeToParents,
				supportingDocsPath
			);

			// Data is returned so that it can be part of the HTML template
			// The expense report was created successfully
			return { success: true, createdExpense };
		} else {
			// The current user is not an admin, therefore they cannot report an absence
			// 401: Forbidden code
			throw error(401, 'In order to create an expense report you must be using an admin account. ');
		}
	}
};
