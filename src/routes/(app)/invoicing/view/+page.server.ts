import { getAllChildren, getAllInvoices, getChildren, getInvoices } from '$lib/util/db';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;

	if (isAdmin === true) {
		// Child and invoice data is fetched from the database
		const invoices = await getAllInvoices();
		const children = await getAllChildren();
		return { invoices, children };
	} else {
		if (account !== undefined) {
			if (account.parentId !== undefined) {
				// Child and invoice data is fetched from the database for the current parent
				const invoices = await getInvoices(account.parentId);
				const children = await getChildren(account.parentId);
				return { invoices, children };
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
	}
};
