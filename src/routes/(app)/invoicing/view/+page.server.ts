import { getAdmin, getParent } from '$lib/util/db';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;

	if (isAdmin === true) {
		const admin = getAdmin();

		// Child and invoice data is fetched from the database
		const invoices = await admin.getInvoices();
		const children = await admin.getChildren();

		// Data is returned so that it can be used in the HTML template
		// Classes cannot be returned to the template so the getData method is called to return JSON data
		return {
			invoices: invoices.map((invoice) => invoice.getData()),
			children: children.map((child) => child.getData())
		};
	} else {
		if (account !== undefined) {
			const parent = await getParent(account.accountId);
			if (parent !== undefined) {
				// Child and invoice data is fetched from the database for the current parent
				const invoices = await parent.getInvoices();
				const children = await parent.getChildren();

				// Data is returned so that it can be used in the HTML template
				// Classes cannot be returned to the template so the getData method is called to return JSON data
				return {
					invoices: invoices.map((invoice) => invoice.getData()),
					children: children.map((child) => child.getData())
				};
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
