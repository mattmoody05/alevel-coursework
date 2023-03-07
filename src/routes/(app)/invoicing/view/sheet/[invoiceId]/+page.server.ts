import { HOURLY_RATE } from '$env/static/private';
import { getInvoice } from '$lib/util/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ params }: PageServerLoadEvent) => {
	const { invoiceId } = params;
	const invoice = await getInvoice(invoiceId);

	if (invoice !== undefined) {
		const expenses = await invoice.getExpenses();
		const sessions = await invoice.getSessions();
		const childData = await invoice.getChild();
		if (childData !== undefined) {
			const parentData = await invoice.getParent();
			if (parentData !== undefined) {
				return {
					invoiceData: invoice.getData(),
					sessionData: sessions.map((session) => session.getData()),
					expenseData: expenses.map((expense) => expense.getData()),
					childData: childData.getData(),
					parentData: parentData.getData(),
					hourlyRate: Number(HOURLY_RATE)
				};
			} else {
				throw error(404, 'parent not found for invoice');
			}
		} else {
			throw error(404, 'child for invoice not found');
		}
	} else {
		throw error(404, 'invoice with that id not found');
	}
};
