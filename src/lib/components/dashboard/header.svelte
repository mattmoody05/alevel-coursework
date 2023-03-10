<script lang="ts">
	export let headerName: string;

	import { getCustomDateString } from '$lib/util/date';
	import { onMount } from 'svelte';

	let dateString = getCustomDateString();

	// Will run when the component is rendered
	onMount(() => {
		// Updates the date shown in the interface
		// Interval of a second
		const interval = setInterval(() => {
			dateString = getCustomDateString();
		}, 1000);

		// Clears the interval so it is not taking up resources when other pages are being shown
		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="header flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4">
	<h1 class="font-bold text-3xl">Welcome back, {headerName}</h1>
	<h3 class="opacity-50 text-xl font-medium">{dateString}</h3>
</div>
