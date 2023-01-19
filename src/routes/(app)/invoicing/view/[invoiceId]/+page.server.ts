import { getChild, getChildren, getInvoice, updateInvoicePaymentStatus } from '$lib/util/db';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ params, locals }: PageServerLoadEvent) => {
	const { account } = locals;
	const { invoiceId } = params;
	if (account !== undefined) {
		if (account.parentId !== undefined) {
			const children = await getChildren(account.parentId);
			if (children !== undefined) {
				const invoiceData = await getInvoice(invoiceId);
				if (invoiceData !== undefined) {
					return { invoiceData, children };
				}
				throw error(500, 'invoice data undefined');
			}
			throw error(500, 'children undefined');
		}
		throw error(500, 'parent id not defined');
	}
	throw error(400, 'account undefined');
};

export const actions: Actions = {
	default: async ({ request, params }: RequestEvent) => {
		const { invoiceId } = params;

		const data = await request.formData();

		const paymentStatus = data.get('paymentStatus') as string;

		await updateInvoicePaymentStatus(invoiceId, paymentStatus);

		return { success: true };
	}
};
