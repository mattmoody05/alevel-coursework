import { createExpense } from '$lib/util/db';
import { presenceCheck, validateDate } from '$lib/util/validation';
import { error, invalid, type Actions } from '@sveltejs/kit';
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

			if (presenceCheck(expenseName) === false) {
				return invalid(400, {
					message:
						'You have not input a name for this expense, please ensure that you have input a name - it cannot be left empty',
					data: {
						expenseName,
						date,
						cost,
						type,
						supportingDocsPath
					}
				});
			} else if (validateDate(date) === false) {
				return invalid(400, {
					message:
						'You have not input a valid date, please ensure that it follows the DD/MM/YYYY format',
					data: {
						expenseName,
						date,
						cost,
						type,
						supportingDocsPath
					}
				});
			} else if (cost > 0) {
				return invalid(400, {
					message: 'The cost for this expense cannot be zero - please input an amount',
					data: {
						expenseName,
						date,
						cost,
						type,
						supportingDocsPath
					}
				});
			} else if (presenceCheck(type) === false) {
				return invalid(400, {
					message:
						'You have not input the type of expense that you are reporting, please input a type - it cannot be left blank',
					data: {
						expenseName,
						date,
						cost,
						type,
						supportingDocsPath
					}
				});
			}

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
