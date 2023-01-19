import { getChild, getChildren, getInvoices } from '$lib/util/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;
	if (account !== undefined) {
		if (account.parentId !== undefined) {
			const invoices = await getInvoices(account.parentId);
			const children = await getChildren(account.parentId);
			return { invoices, children };
		}
		throw error(500, 'parent id undefined');
	}
	throw error(400, 'account undefined');
};
