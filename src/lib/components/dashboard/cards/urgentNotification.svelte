<script lang="ts">
	import { LinkButton } from '$lib/components/button';
	import { CardWrapper } from '$lib/components/dashboard/cards';
	import { UrgentNotificationCardView } from '$lib/components/notifications';

	export let totalUrgentNotifications: number;
	export let thisWeekNotifications: number;
	export let recentNotification: { notificationName: string; content: string } | undefined;
</script>

<CardWrapper title="Urgent notifications">
	<div class="w-full grid grid-cols-2">
		<div class="flex flex-col">
			<span class="text-sm opacity-50">Urgent notifications</span>
			<span class="text-4xl font-bold">{String(totalUrgentNotifications)}</span>
		</div>
		<div class="flex flex-col">
			<span class="text-sm opacity-50">This week</span>
			<span class="text-4xl font-bold">{String(thisWeekNotifications)}</span>
		</div>
	</div>
	<div class="mt-4">
		<span>Recent notifications</span>
		<div class="mt-1">
			{#if recentNotification !== undefined}
				<UrgentNotificationCardView
					title={recentNotification.notificationName}
					content={recentNotification.content}
				/>
			{:else}
				<span class="text-sm opacity-50">No recent notifications</span>
			{/if}
		</div>
		<div class="mt-2 flex justify-center w-full">
			<LinkButton href="/messaging/short-notice/view" style="secondary">See all</LinkButton>
		</div>
	</div>
</CardWrapper>
