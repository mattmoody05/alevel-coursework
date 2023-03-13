<script lang="ts">
	import { Button } from '$lib/components/button';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>View time off period</title>
</svelte:head>

<div class="flex flex-col gap-2">
	<h3 class="font-bold text-xl">View time off period</h3>
	<div class="">
		<span class="font-bold">Start date: </span><span>{data.timeOffPeriod.startDate}</span>
	</div>
	<div class="">
		<span class="font-bold">End date: </span><span>{data.timeOffPeriod.endDate}</span>
	</div>
	<div class="">
		<span class="font-bold">Cancel sessions? </span><span
			>{data.timeOffPeriod.cancelSessions ? 'Yes' : 'No'}</span
		>
	</div>
	<form method="POST" action="?/delete">
		<Button style="danger">Remove time off period</Button>
	</form>
</div>
