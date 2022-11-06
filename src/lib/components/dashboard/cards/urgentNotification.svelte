<script lang="ts">
	import { LinkButton } from '$lib/components/button';
	import { CardWrapper } from '$lib/components/dashboard/cards';
	import { UrgentNotificationCardView } from '$lib/components/notifications';
</script>

<CardWrapper title="Urgent notifications">
	<div class="w-full grid grid-cols-2">
		<div class="flex flex-col">
			<span class="text-sm opacity-50">Urgent notifications</span>
			<span class="text-4xl font-bold">4</span>
		</div>
		<div class="flex flex-col">
			<span class="text-sm opacity-50">Unread</span>
			<span class="text-4xl font-bold">1</span>
		</div>
	</div>
	<div class="mt-4">
		<span>Unread notifications</span>
		<div class="mt-1">
			<UrgentNotificationCardView
				title="Coronavirus regulations"
				content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
			/>
		</div>
		<div class="mt-2 flex justify-center w-full">
			<LinkButton href="/messaging" style="secondary">See all</LinkButton>
		</div>
	</div>
</CardWrapper>
