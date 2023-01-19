import { getAccountId } from '$lib/util/cookies';
import {
	generateInvoice,
	getAccount,
	getAllChildren,
	getAllParents,
	getParent,
	writeInvoice
} from '$lib/util/db';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import type { child, parent } from '$lib/util/types';

export const load: PageServerLoad = async ({ cookies }: PageServerLoadEvent) => {
	const accountId: string | undefined = await getAccountId(cookies);
	if (accountId !== undefined) {
		const accountData = await getAccount(accountId);
		if (accountData !== undefined) {
			if (accountData.isAdmin) {
				const children: child[] | undefined = await getAllChildren();
				if (children !== undefined) {
					let childrenSummary: {
						childId: string;
						firstName: string;
						lastName: string;
						parentFirstName: string;
						parentLastName: string;
						parentId: string;
					}[] = [];
					for (let index = 0; index < children.length; index++) {
						const currentChild = children[index];
						const childParent = await getParent(currentChild.parentId, 'parent');
						if (childParent !== undefined) {
							childrenSummary = [
								...childrenSummary,
								{
									childId: currentChild.childId,
									firstName: currentChild.firstName,
									lastName: currentChild.lastName,
									parentFirstName: childParent.firstName,
									parentLastName: childParent.lastName,
									parentId: childParent.parentId
								}
							];
						} else {
							throw error(400, 'child parent is undefined');
						}
					}
					const parents: parent[] | undefined = await getAllParents();
					if (parents !== undefined) {
						return { childrenSummary, parents };
					}
					throw error(400, 'parents undefined');
				}
				throw error(400, 'children or parents is not defined');
			}
			throw error(400, 'must be admin to access page');
		}
		throw error(400, 'account not found');
	}
	throw error(400, 'account id undefined');
};

export const actions: Actions = {
	default: async ({ cookies, request }: RequestEvent) => {
		const data = await request.formData();

		const childId = data.get('childId') as string;
		const startDate = data.get('startDate') as string;
		const endDate = data.get('endDate') as string;
		const additionalChargeName = data.get('additionalChargeName') as string;
		const additionalChargeAmount = Number(data.get('additionalChargeAmount') as string) * 100;
		const discountName = data.get('discountName') as string;
		const discountAmount = Number(data.get('discountAmount') as string);
		const includeExpenses = data.get('includeExpenses') === 'on' ? true : false;
		const parentId = data.get('parentId') as string;
		const message = data.get('invoiceMessage') as string;
		const dateDue = data.get('dateDue') as string;
		const generatedInvoice = await generateInvoice({
			childId,
			startDate,
			endDate,
			additionalChargeAmount,
			additionalChargeName,
			discountAmount,
			discountName,
			includeExpenses,
			parentId,
			message,
			dateDue
		});

		await writeInvoice(generatedInvoice);

		return { success: true, generatedInvoice };
	}
};
