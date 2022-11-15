<script lang="ts">
	import { getCustomDateString } from '$lib/util/date';
	import { onMount } from 'svelte';

	let dateString: string = getCustomDateString();

	onMount(() => {
		const interval = setInterval(() => {
			dateString = getCustomDateString();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div
	class="flex justify-between p-2 rounded-xl border border-gray-300 bg-gray-100 overflow-y-scroll min-h-max "
>
	<button
		class="text-sm hover:bg-gray-200 max-w-max p-2 rounded-lg hover:cursor-pointer flex gap-1 items-center"
		on:click={() => history.back()}
	>
		<i class="fa-solid fa-arrow-left opacity-50" />
		<span class="opacity-50">Back</span>
	</button>

	<div
		class="backButton text-sm hover:bg-gray-200 max-w-max p-2 rounded-lg hover:cursor-pointer flex items-center"
	>
		<span class="opacity-50">{dateString}</span>
	</div>
</div>
