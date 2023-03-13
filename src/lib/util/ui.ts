import type { ChildTable, ParentTable } from './db';

// Returns a tailwindcss colour code based off a string
// Works from using the length of the string to calculate the colour
// All colours have been selected to be compatible in the UI - otherwise contrast could be an issue
export function stringToColour(str: string | undefined): string {
	if (str === undefined) {
		return 'bg-indigo-500';
	}

	const colours = [
		'bg-indigo-500',
		'bg-red-600',
		'bg-orange-500',
		'bg-emerald-600',
		'bg-cyan-600',
		'bg-blue-600',
		'bg-sky-500',
		'bg-violet-500',
		'bg-rose-500',
		'bg-lime-500',
		'bg-gray-800'
	];
	if (str.length < 12) {
		return colours[str.length - 1];
	}
	return colours[Math.floor(str.length / 2)];
}

// Capitalises the first letter of a string
export function capitaliseFirst(text: string): string {
	return `${text[0].toUpperCase()}${text.substring(1, text.length)}`;
}

// Gets the child's name given the childId and the array of child data
export function getChildName(childId: string, children: ChildTable[]) {
	for (let i = 0; i < children.length; i++) {
		const currentChild = children[i];
		if (currentChild.childId === childId) {
			return {
				firstName: currentChild.firstName,
				lastName: currentChild.lastName,
				fullName: `${currentChild.firstName} ${currentChild.lastName}`,
				childFound: true
			};
		}
	}
	return {
		firstName: '',
		lastName: '',
		fullName: '',
		childFound: false
	};
}

// Gets the parent's name given the childId and the array of parent data
export function getParentName(parentId: string, parents: ParentTable[]) {
	for (let i = 0; i < parents.length; i++) {
		const currentParent = parents[i];
		if (currentParent.parentId === parentId) {
			return {
				firstName: currentParent.firstName,
				lastName: currentParent.lastName,
				fullName: `${currentParent.firstName} ${currentParent.lastName}`,
				childFound: true
			};
		}
	}
	return {
		firstName: '',
		lastName: '',
		fullName: '',
		childFound: false
	};
}

// Scrolls to the bottom of the specified HTML element
export function scrollToBottom(element: HTMLElement) {
	element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
}
