<script lang="ts">
	import { UrgentNotificationCardView } from '$lib/components/notifications';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>View short notice notification</title>
</svelte:head>

<h3 class="font-bold text-xl">View notifications</h3>
<div class="grid lg:grid-cols-2 gap-2 mt-2">
	{#each data.notifications as notification}
		<UrgentNotificationCardView title={notification.dateCreated} content={notification.message} />
	{/each}
</div>
