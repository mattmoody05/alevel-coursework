import { generateInvoice } from '$lib/util/generate';
import { createInvoice, getAdmin } from '$lib/util/db';
import { getParentName } from '$lib/util/ui';
import { presenceCheck, validateDate } from '$lib/util/validation';
import { error, invalid } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin } = locals;
	if (isAdmin === true) {
		const admin = getAdmin();
		// All child and parent data is fetched from the database
		const children = await admin.getChildren();
		const parents = await admin.getParents();

		let childrenSummary: {
			childId: string;
			firstName: string;
			lastName: string;
			parentFirstName: string;
			parentLastName: string;
			parentId: string;
		}[] = [];

		// Parent and child data is mapped to the childrenSummary array
		childrenSummary = children.map((child) => {
			return {
				childId: child.childId,
				firstName: child.firstName,
				lastName: child.lastName,
				parentFirstName: getParentName(child.parentId, parents).firstName,
				parentLastName: getParentName(child.parentId, parents).lastName,
				parentId: child.parentId
			};
		});

		// Data is returned so that it can be part of the HTML template
		return { childrenSummary, parents: parents.map((parent) => parent.getData()) };
	} else {
		// The current user is not an admin, they do not have the rights to view the data
		// 401: Forbidden code
		throw error(401, 'You must be an admin to create an invoice');
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to create an invoice
	createInvoice: async ({ request, locals }: RequestEvent) => {
		const { isAdmin } = locals;

		if (isAdmin === true) {
			// Accessing the formdata that has been submitted by the user
			const data = await request.formData();
			const childId = data.get('childId') as string;
			const startDate = data.get('startDate') as string;
			const endDate = data.get('endDate') as string;
			const additionalChargeName = data.get('additionalChargeName') as string;
			const discountName = data.get('discountName') as string;
			const parentId = data.get('parentId') as string;
			const message = data.get('invoiceMessage') as string;
			const dateDue = data.get('dateDue') as string;

			// All HTML form inputs use the string data type
			// Casts the string data type from the form to number data type
			const discountAmount = Number(data.get('discountAmount') as string);

			// Converts the value from pounds into pence to avoid storing real values in the database
			const additionalChargeAmount = Number(data.get('additionalChargeAmount') as string) * 100;

			// By default, checkboxes return a string of "on" if they are in the checked state
			// Casts the string state to a boolean value
			const includeExpenses = data.get('includeExpenses') === 'on' ? true : false;

			if (validateDate(startDate) === false) {
				return invalid(400, {
					message:
						'You have not input a valid start date, please ensure it follows the DD/MM/YYYY format',
					data: {
						childId,
						startDate,
						endDate,
						additionalChargeAmount,
						additionalChargeName,
						discountAmount,
						discountName,
						parentId,
						message,
						dateDue,
						includeExpenses
					}
				});
			} else if (validateDate(endDate) === false) {
				return invalid(400, {
					message:
						'You have not input a valid end date, please ensure it follows the DD/MM/YYYY format',
					data: {
						childId,
						startDate,
						endDate,
						additionalChargeAmount,
						additionalChargeName,
						discountAmount,
						discountName,
						parentId,
						message,
						dateDue,
						includeExpenses
					}
				});
			} else if (validateDate(dateDue) === false) {
				return invalid(400, {
					message:
						'You have not input a valid due date, please ensure it follows the DD/MM/YYYY format',
					data: {
						childId,
						startDate,
						endDate,
						additionalChargeAmount,
						additionalChargeName,
						discountAmount,
						discountName,
						parentId,
						message,
						dateDue,
						includeExpenses
					}
				});
			} else if (presenceCheck(childId) === false) {
				return invalid(400, {
					message: 'You have not specified a child, please ensure that you have selected a child',
					data: {
						childId,
						startDate,
						endDate,
						additionalChargeAmount,
						additionalChargeName,
						discountAmount,
						discountName,
						parentId,
						message,
						dateDue,
						includeExpenses
					}
				});
			} else if (presenceCheck(parentId) === false) {
				return invalid(400, {
					message: 'You have not specified a parent, please ensure that you have selected a parent',
					data: {
						childId,
						startDate,
						endDate,
						additionalChargeAmount,
						additionalChargeName,
						discountAmount,
						discountName,
						parentId,
						message,
						dateDue,
						includeExpenses
					}
				});
			} else if (additionalChargeAmount >= 0 && additionalChargeAmount <= 100) {
				return invalid(400, {
					message:
						'Additional charge amount is not in the correct range, please ensure that it is between 0 and 100',
					data: {
						childId,
						startDate,
						endDate,
						additionalChargeAmount,
						additionalChargeName,
						discountAmount,
						discountName,
						parentId,
						message,
						dateDue,
						includeExpenses
					}
				});
			} else if (discountAmount >= 0 && discountAmount <= 100) {
				return invalid(400, {
					message:
						'Discount charge amount is not in the correct range, please ensure that it is between 0 and 100',
					data: {
						childId,
						startDate,
						endDate,
						additionalChargeAmount,
						additionalChargeName,
						discountAmount,
						discountName,
						parentId,
						message,
						dateDue,
						includeExpenses
					}
				});
			}

			// Generates an invoice using the data that has been extracted from the form
			// All data has been casted to the correct data type
			// All data is in the right format
			const generatedInvoice = await generateInvoice({
				childId,
				startDate,
				endDate,
				additionalChargeAmount,
				additionalChargeName,
				discountAmount,
				discountName,
				includeExpenses,
				parentId,
				message,
				dateDue
			});

			// Writes the previously generated invoice to the database
			const invoice = await createInvoice(generatedInvoice.getData());

			// Sends a confirmation email to the parent the invoice has been issued to prompting them to view the invoice
			await invoice.sendConfirmationEmail();

			// Data is returned so that it can be part of the HTML template
			// The invoice was successfully generated and written
			return { success: true, generatedInvoice };
		} else {
			// The current user is not an admin, they do not have the rights to create invoices
			// 401: Forbidden code
			throw error(401, 'You must be an admin to create and issue invocies. ');
		}
	}
};
