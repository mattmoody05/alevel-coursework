import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ cookies }: PageServerLoadEvent) => {
	// Deletes the cookie that holds the user's accountId
	cookies.delete('token');

	return { success: true };
};
