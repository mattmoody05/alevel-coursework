<script lang="ts">
	import { DashboardHeader } from '$lib/components/dashboard';
	import {
		AbsenceCard,
		InvoiceCard,
		SurveyCard,
		ThisWeekCard,
		UrgentNotificationCard
	} from '$lib/components/dashboard/cards';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<DashboardHeader headerName="Matthew" />
<div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mt-2">
	<ThisWeekCard
		childrenBooked={10}
		sessionsBooked={3}
		recentSessions={[
			{
				childName: 'Matthew',
				date: '10/12/22',
				time: '11:00'
			},
			{
				childName: 'Ella',
				date: '08/12/22',
				time: '09:00'
			},
			{
				childName: 'Kabir',
				date: '05/12/22',
				time: '11:00'
			},
			{
				childName: 'Dan',
				date: '05/12/22',
				time: '09:00'
			}
		]}
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
