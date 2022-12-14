<script lang="ts">
	import { LinkButton } from '$lib/components/button';
	import { CardWrapper } from '$lib/components/dashboard/cards';
	import { UrgentNotificationCardView } from '$lib/components/notifications';
	import type { urgentNotificationSummary } from '$lib/util/types';

	export let totalUrgentNotifications: number;
	export let unreadUrgentNotifications: number;
	export let recentNotification: urgentNotificationSummary;
</script>

<CardWrapper title="Urgent notifications">
	<div class="w-full grid grid-cols-2">
		<div class="flex flex-col">
			<span class="text-sm opacity-50">Urgent notifications</span>
			<span class="text-4xl font-bold">{String(totalUrgentNotifications)}</span>
		</div>
		<div class="flex flex-col">
			<span class="text-sm opacity-50">This week</span>
			<span class="text-4xl font-bold">{String(unreadUrgentNotifications)}</span>
		</div>
	</div>
	<div class="mt-4">
		<span>Recent notifications</span>
		<div class="mt-1">
			<UrgentNotificationCardView
				title={recentNotification.notificationName}
				content={recentNotification.content}
			/>
		</div>
		<div class="mt-2 flex justify-center w-full">
			<LinkButton href="/messaging/short-notice/view" style="secondary">See all</LinkButton>
		</div>
	</div>
</CardWrapper>
