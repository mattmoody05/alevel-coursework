<script lang="ts">
	export let headerName: string;

	import { getCustomDateString } from '$lib/util/date';
	import { onMount } from 'svelte';

	let dateString = getCustomDateString();

	onMount(() => {
		const interval = setInterval(() => {
			dateString = getCustomDateString();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="header flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4">
	<h1 class="font-bold text-3xl">Welcome back, {headerName}</h1>
	<h3 class="opacity-50 text-xl font-medium">{dateString}</h3>
</div>
