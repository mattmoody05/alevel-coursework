import { createExpense } from '$lib/util/db';
import type { Actions } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export const actions: Actions = {
	default: async ({ request }: RequestEvent) => {
		const data = await request.formData();
		const expenseName = data.get('expenseName') as string;
		const date = data.get('date') as string;
		const cost = Number(data.get('cost') as string) * 100;
		const type = data.get('type') as string;
		const supportingDocsPath = data.get('supportingDocsPath') as string;
		const chargeToParents = (data.get('chargeParents') as string) === 'on' ? true : false;

		const createdExpense = await createExpense(
			expenseName,
			date,
			cost,
			type,
			chargeToParents,
			supportingDocsPath
		);

		return { success: true, createdExpense };
	}
};
