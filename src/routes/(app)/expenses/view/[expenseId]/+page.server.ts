import { deleteExpense, getExpense, updateExpense } from '$lib/util/db';
import type { expense } from '$lib/util/types';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ params }: PageServerLoadEvent) => {
	if (params.expenseId !== '') {
		const expenseData: expense | undefined = await getExpense(params.expenseId);
		if (expenseData !== undefined) {
			return { expenseData };
		}
		throw error(400, 'expenseData undefined');
	}

	throw error(400, 'slug undefined');
};

export const actions: Actions = {
	updateExpense: async ({ request, params }: RequestEvent) => {
		const data = await request.formData();
		const expenseId = params.expenseId;
		const expenseName = data.get('name') as string;
		const date = data.get('date') as string;
		const cost = Number(data.get('cost') as string) * 100;
		const type = data.get('type') as string;
		const supportingDocsPath = data.get('supportingDocsPath') as string;
		const chargeToParents = (data.get('chargeToParents') as string) === 'on' ? true : false;

		await updateExpense(
			expenseId,
			expenseName,
			date,
			cost,
			type,
			chargeToParents,
			supportingDocsPath
		);

		const updatedExpense: expense | undefined = await getExpense(expenseId);
		if (updateExpense !== undefined) {
			throw redirect(300, '/expenses/view?redirect-from=update-session');
		}
		throw error(500, 'updatedExpense undefined');
	},
	deleteExpense: async ({ request, params }: RequestEvent) => {
		const expenseId = params.expenseId;
		await deleteExpense(expenseId);
		throw redirect(300, '/expenses/view?redirect-from=delete-session');
	}
};
