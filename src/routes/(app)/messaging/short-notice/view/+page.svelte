<script lang="ts">
	import { FilterButton, SortButton } from '$lib/components/filters';
	import { UrgentNotificationCardView } from '$lib/components/notifications';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>View short notice notification</title>
</svelte:head>

<h3 class="font-bold text-xl">View notifications</h3>
<div class="flex gap-2">
	<FilterButton allowedFilterTypes={['Child', 'Date', 'Name']} />
	<SortButton allowedSortTypes={['None', 'Child', 'Date', 'Name']} />
</div>
<div class="grid lg:grid-cols-2 gap-2 mt-2">
	{#each data.notifications as notification}
		<UrgentNotificationCardView title={notification.dateCreated} content={notification.message} />
	{/each}
</div>
