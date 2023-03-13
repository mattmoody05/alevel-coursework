import { getParent, getInvoice } from '$lib/util/db';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ params, locals }: PageServerLoadEvent) => {
	const { account } = locals;
	if (params.invoiceId !== '') {
		if (account !== undefined) {
			const parent = await getParent(account.accountId);
			if (parent !== undefined) {
				// Child and invoice data is fetched from the database
				const children = await parent.getChildren();
				const invoice = await getInvoice(params.invoiceId);

				if (invoice !== undefined) {
					// Data is returned to the HTML template
					// Classes cannot be returned to the template so the getData method is called to return JSON data
					return {
						invoiceData: invoice.getData(),
						children: children.map((child) => child.getData())
					};
				} else {
					// No invoice was returned from the database with the specified invoiceId
					// 404: Not found code
					throw error(404, 'There was no invoice found with the invoiceId provided.');
				}
			} else {
				// The parentId field of the account record is undefined - therefore the account is not linked to a parent
				// 400: Bad request code
				throw error(
					400,
					'There is no parent associated with the current account. If an admin account is being used, please switch to a parent account.'
				);
			}
		} else {
			// No user is currently logged in
			// User is redirected to the login page
			// 308: Permanent redirect code
			throw redirect(308, '/login');
		}
	} else {
		// The user did not specifiy a invoiceId for the invoice they want to view
		// 400: Bad request code
		throw error(
			400,
			'A invoiceId was not provided. Please make sure an invoiceId is provided in the URL to view an invoice.'
		);
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to update the payment status of the invoice that they are viewing
	updatePaymentStatus: async ({ request, params }: RequestEvent) => {
		// Accessing the formdata that has been submitted by the user
		const data = await request.formData();
		const paymentStatus = data.get('paymentStatus') as string;

		const invoice = await getInvoice(params.invoiceId);

		if (invoice !== undefined) {
			// Updating the payment status of the invoice in the database
			await invoice.updatePaymentStatus(paymentStatus);

			// Data is returned so that it can be part of the HTML template
			// The invoice payment status was updated successfully
			return { success: true };
		} else {
			// An invoice with the invoiceId specified could not be found
			// 404: Not found code
			throw error(
				404,
				'An invoice with the invoiceId specified could not be found in the database, please ensure that you have input a valid invoiceId'
			);
		}
	}
};
