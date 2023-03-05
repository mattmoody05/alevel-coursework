import { deleteExpense, getExpense, updateExpense } from '$lib/util/db';
import { presenceCheck, validateDate } from '$lib/util/validation';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ params, locals }: PageServerLoadEvent) => {
	const { isAdmin } = locals;
	if (isAdmin === true) {
		if (params.expenseId !== '') {
			// Fetches the expence with the expenseId specified in the page's URL from the database
			const expenseData = await getExpense(params.expenseId);
			if (expenseData !== undefined) {
				// Data is returned so that it can be part of the HTML template
				return { expenseData };
			} else {
				// No expense matching the provided expenseId was returned from the databse
				// 404: Not found code
				throw error(404, 'An expense report with that expenseId could not be found');
			}
		} else {
			// The user did not provide an expenseId to view
			// 400: Bad request code
			throw error(400, 'No expenseId has been provided in the page URL. Please ensure that a ');
		}
	} else {
		// The current user is not an admin, they do not have the rights to view the data
		// 401: Forbidden code
		throw error(401, 'You must be an admin to view expense reports');
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to update an expense report
	updateExpense: async ({ request, params, locals }: RequestEvent) => {
		const { isAdmin } = locals;

		if (isAdmin === true) {
			// Accessing the formdata that has been submitted by the user
			const data = await request.formData();
			const expenseId = params.expenseId;
			const expenseName = data.get('name') as string;
			const date = data.get('date') as string;
			const cost = Number(data.get('cost') as string) * 100;
			const type = data.get('type') as string;
			const supportingDocsPath = data.get('supportingDocsPath') as string;

			// By default, checkboxes return a string of "on" if they are in the checked state
			// Casts the string state to a boolean value
			const chargeToParents = (data.get('chargeToParents') as string) === 'on' ? true : false;

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

			// Updates the expense report in the database
			await updateExpense(
				expenseId,
				expenseName,
				date,
				cost,
				type,
				chargeToParents,
				supportingDocsPath
			);

			// Redirects the user to the page to view all expenses
			// The redirect-from query parameter tells the new page what action has occured so the interface can reflect that
			throw redirect(308, '/expenses/view?redirect-from=update-session');
		} else {
			// The current user is not an admin, they do not have the rights to modify absence reports
			// 401: Forbidden code
			throw error(401, 'You must be an admin to update expense reports');
		}
	},

	// Handles the user submitting the form to delete an expense report
	deleteExpense: async ({ params, locals }: RequestEvent) => {
		const { isAdmin } = locals;
		if (isAdmin === true) {
			// Deletes the expense report in the database
			await deleteExpense(params.expenseId);

			// Redirects the user to the page to view all expenses
			// The redirect-from query parameter tells the new page what action has occured so the interface can reflect that
			throw redirect(300, '/expenses/view?redirect-from=delete-session');
		} else {
			// The current user is not an admin, they do not have the rights to delete absence reports
			// 401: Forbidden code
			throw error(401, 'You must be an admin to delete expense reports');
		}
	}
};
