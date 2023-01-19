import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ params }: PageServerLoadEvent) => {
	const { invoiceId } = params;
	return {};
};
