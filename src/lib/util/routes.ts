import type { route } from '$lib/util/types';

export const routes: route[] = [
	{
		name: 'Dashboard',
		iconClass: 'fa-solid fa-gauge',
		url: '/',
		adminOnly: false
	},
	{
		name: 'Messaging',
		iconClass: 'fa-solid fa-message',
		url: '/messaging',
		adminOnly: false
	},
	{
		name: 'Invoicing',
		iconClass: 'fa-solid fa-receipt',
		url: '/invoicing',
		adminOnly: false
	},
	{
		name: 'Absence',
		iconClass: 'fa-solid fa-thermometer',
		url: '/absence',
		adminOnly: false
	},
	{
		name: 'Sessions',
		iconClass: 'fa-solid fa-calendar-days',
		url: '/session',
		adminOnly: false
	},
	{
		name: 'Recurring sessions',
		iconClass: 'fa-solid fa-arrows-rotate',
		url: '/recurring-session',
		adminOnly: false
	},
	{
		name: 'Surveys',
		iconClass: 'fa-solid fa-square-poll-vertical',
		url: '/survey',
		adminOnly: false
	},
	{
		name: 'Register child',
		iconClass: 'fa-solid fa-pen',
		url: '/register-child',
		adminOnly: false
	},
	{
		name: 'Time off',
		iconClass: 'fa-solid fa-calendar-xmark',
		url: '/time-off',
		adminOnly: true
	},
	{
		name: 'Expenses',
		iconClass: 'fa-solid fa-money-bill',
		url: '/expenses',
		adminOnly: true
	}
];
