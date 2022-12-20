import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ cookies }: PageServerLoadEvent) => {
	cookies.delete('token');
	return { success: true };
};
