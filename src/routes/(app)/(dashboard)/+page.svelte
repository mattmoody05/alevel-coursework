<script lang="ts">
	import { DashboardHeader } from '$lib/components/dashboard';
	import {
		AbsenceCard,
		InvoiceCard,
		SurveyCard,
		ThisWeekCard,
		UrgentNotificationCard
	} from '$lib/components/dashboard/cards';
	import type { session } from '$lib/util/types';
	import type { PageData } from './$types';

	export let data: PageData;

	let recentSessions: { childName: string; date: string; time: string }[] = [];

	function getChildName(childId: string) {
		const children = data.children.filter((child) => child.childId === childId);
		return children[0].firstName;
	}

	for (let index = 0; index < data.sessions.length; index++) {
		const currentSession: session = data.sessions[index];
		recentSessions = [
			...recentSessions,
			{
				childName: getChildName(currentSession.childId),
				date: currentSession.date,
				time: currentSession.startTime
			}
		];
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
		childrenBooked={data.children.length}
		sessionsBooked={data.sessions.length}
		{recentSessions}
	/>
	<UrgentNotificationCard
		recentNotification={{
			notificationName: 'Coronavirus regulations',
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
		}}
		totalUrgentNotifications={10}
		unreadUrgentNotifications={1}
	/>
	<AbsenceCard
		absenceReports={[
			{
				childName: 'Jon',
				startDate: '10/11/22',
				endDate: '12/11/22'
			}
		]}
		absencesReported={1}
	/>
	<SurveyCard
		surveysIssued={10}
		surveysPending={2}
		recentSurveys={[
			{
				dueDate: '20/10/22',
				surveyName: 'Photo consent form'
			},
			{
				dueDate: '01/10/22',
				surveyName: 'Monthly check in'
			},
			{
				dueDate: '01/09/22',
				surveyName: 'Monthly check in'
			},
			{
				dueDate: '01/09/22',
				surveyName: 'Back to school survey'
			}
		]}
	/>
	<InvoiceCard
		invoicesDue={1}
		invoicesIssued={10}
		recentInvoices={[
			{
				amountDue: 11889,
				dueDate: '01/11/22'
			},
			{
				amountDue: 7910,
				dueDate: '01/10/22'
			},
			{
				amountDue: 10967,
				dueDate: '01/09/22'
			},
			{
				amountDue: 5779,
				dueDate: '01/08/22'
			}
		]}
	/>
</div>
