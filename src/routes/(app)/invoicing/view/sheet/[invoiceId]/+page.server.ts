import { HOURLY_RATE } from '$env/static/private';
import { getInvoice } from '$lib/util/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ params }: PageServerLoadEvent) => {
	const { invoiceId } = params;
	const invoice = await getInvoice(invoiceId);

	if (invoice !== undefined) {
		// All data realted to the invoice is fetched from the database
		const expenses = await invoice.getExpenses();
		const sessions = await invoice.getSessions();
		const childData = await invoice.getChild();

		if (childData !== undefined) {
			const parentData = await invoice.getParent();
			if (parentData !== undefined) {
				// Returns data to the HTML template
				// Classes cannot be returned to the template, so the getData method is called to return JSON data
				return {
					invoiceData: invoice.getData(),
					sessionData: sessions.map((session) => session.getData()),
					expenseData: expenses.map((expense) => expense.getData()),
					childData: childData.getData(),
					parentData: parentData.getData(),
					hourlyRate: Number(HOURLY_RATE)
				};
			} else {
				// The parent that the invoice was issued to cannot be found
				// 404: Not found code
				throw error(
					404,
					'The parent that this invoice was issued to cannot be found. Please try again later.'
				);
			}
		} else {
			// The child that the invoice was generated for could not be found
			// 404: Not found code
			throw error(
				404,
				'The child that the invoice was generated for could not be found. Please try again later.'
			);
		}
	} else {
		// The invoice with the invoiceId specified could not be found
		// 404: Not found code
		throw error(
			404,
			'An invoice with that invoiceId could not be found. Please ensure that you have specified a valid invoiceId.'
		);
	}
};
