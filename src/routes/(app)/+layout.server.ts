import type { LayoutServerLoad, LayoutServerLoadEvent } from './$types';

export const load: LayoutServerLoad = ({ locals }: LayoutServerLoadEvent) => {
	// Exposes the isAdmin local variable to each page
	const { isAdmin } = locals;
	return { isAdmin };
};
