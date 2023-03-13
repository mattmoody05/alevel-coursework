<script lang="ts">
	import { DashboardHeader } from '$lib/components/dashboard';
	import {
		AbsenceCard,
		InvoiceCard,
		SurveyCard,
		ThisWeekCard,
		UrgentNotificationCard
	} from '$lib/components/dashboard/cards';
	import { getDateFromLocaleString } from '$lib/util/date';
	import type { SessionTable } from '$lib/util/db';
	import type { PageData } from './$types';
	import { getChildName } from '$lib/util/ui';

	export let data: PageData;

	let recentSessions: { childName: string; date: string; time: string }[] = [];
	let childrenBooked: string[] = [];
	let thisWeekNotifications = 0;

	// Creates an absence summary array with the data from all absence reports
	const absenceSummaries: { childName: string; date: string }[] = data.absences.map((absence) => ({
		childName: getChildName(absence.childId, data.children).firstName,
		date: absence.date
	}));

	// Sorts sessions by date using the quicksort algorithm
	function quickSortSessions(arr: SessionTable[]): SessionTable[] {
		if (arr.length <= 1) {
			return arr; // Base case: an array of length 1 is already sorted
		}

		function getDateInt(session: SessionTable) {
			return getDateFromLocaleString(session.date).getTime();
		}

		// Choose a pivot element
		const pivotIndex = Math.floor(arr.length / 2);
		const pivot = arr[pivotIndex];

		// Partition the array around the pivot
		let less: SessionTable[] = [];
		let greater: SessionTable[] = [];
		for (let i = 0; i < arr.length; i++) {
			if (i === pivotIndex) {
				continue; // Skip the pivot element
			}
			if (getDateInt(arr[i]) < getDateInt(pivot)) {
				less = [...less, arr[i]];
			} else {
				greater = [...greater, arr[i]];
			}
		}

		// Recursively sort the two partitions
		const sortedLess = quickSortSessions(less);
		const sortedGreater = quickSortSessions(greater);

		// Combine the sorted partitions with the pivot element
		return [...sortedLess, pivot, ...sortedGreater];
	}

	data.sessions = quickSortSessions(data.sessions);

	// Filters the sessions so only those in the next 7 days are shown
	for (let index = 0; index < data.sessions.length; index++) {
		const currentSession: SessionTable = data.sessions[index];
		let currentDate = new Date();
		for (let i = 0; i < 7; i++) {
			if (currentSession.date === currentDate.toLocaleDateString('en-GB')) {
				if (childrenBooked.includes(currentSession.childId) === false) {
					childrenBooked = [...childrenBooked, currentSession.childId];
				}
				recentSessions = [
					...recentSessions,
					{
						childName: getChildName(currentSession.childId, data.children).firstName,
						date: currentSession.date,
						time: currentSession.startTime
					}
				];
			}
			currentDate = new Date(currentDate.getTime() + 86400000);
		}
	}

	// Calculates how many notifications have been issued in the last week
	// Sets thisWeekNotifications variable to this amount
	for (let index = 0; index < data.notifications.length; index++) {
		const currentNotification = data.notifications[index];
		const notiDate = getDateFromLocaleString(currentNotification.dateCreated);
		const nowDate = new Date();

		const diffInHrs = (nowDate.getTime() - notiDate.getTime()) / 1000 / 60 / 60;

		// 168 hours in a week (7 24hour days)
		if (diffInHrs < 168) {
			thisWeekNotifications = thisWeekNotifications + 1;
		}
	}
</script>

<svelte:head>
	<title>{data.isAdmin ? 'Admin' : ''} Dashboard</title>
</svelte:head>

{#if data.isAdmin}
	<DashboardHeader headerName="Admin" />
{:else}
	<DashboardHeader headerName={data.parentData.firstName} />
{/if}

<div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mt-2">
	<ThisWeekCard
		childrenBooked={childrenBooked.length}
		sessionsBooked={recentSessions.length}
		{recentSessions}
	/>
	{#if data.notifications.length === 0}
		<UrgentNotificationCard
			recentNotification={undefined}
			totalUrgentNotifications={data.notifications.length}
			{thisWeekNotifications}
		/>
	{:else}
		<UrgentNotificationCard
			recentNotification={{
				notificationName: data.notifications[data.notifications.length - 1].dateCreated,
				content: data.notifications[data.notifications.length - 1].message
			}}
			totalUrgentNotifications={data.notifications.length}
			{thisWeekNotifications}
		/>
	{/if}
	<AbsenceCard absenceReports={absenceSummaries} absencesReported={1} />
	<SurveyCard
		surveysIssued={10}
		surveysPending={2}
		recentSurveys={data.surveys.map((survey) => ({
			dateCreated: survey.dateCreated,
			surveyName: survey.title
		}))}
	/>
	<InvoiceCard
		invoicesDue={1}
		invoicesIssued={10}
		recentInvoices={data.invoices.map((invoice) => ({
			amountDue: invoice.total,
			dueDate: invoice.dateDue
		}))}
	/>
</div>
