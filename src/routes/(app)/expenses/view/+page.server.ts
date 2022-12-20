import { getAllExpenses } from '$lib/util/db';
import type { expense } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ locals, url }: PageServerLoadEvent) => {
	if (locals.isAdmin) {
		const expenses: expense[] | undefined = await getAllExpenses();
		if (expenses !== undefined) {
			let redirectFrom;
			if (url.searchParams.has('redirect-from')) {
				redirectFrom = url.searchParams.get('redirect-from') as string;
			}
			return { expenses, redirectFrom };
		}
		throw error(400, 'expenses undefined');
	}
	throw error(400, 'must be admin to view');
};
