<script lang="ts">
	import { getCustomDateString } from '$lib/util/date';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let dateString: string = getCustomDateString();

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

	// Function to navigate up a level in the interface
	// E.G /invoices/view to /invoices
	function goBack() {
		let url = $page.url;
		let urlParts = url.pathname.split('/');
		let newUrl = '';
		if (urlParts.length === 2) {
			goto('/');
		} else {
			for (let index = 0; index + 1 < urlParts.length; index++) {
				const currentUrlPart = urlParts[index];
				if (currentUrlPart !== '') {
					newUrl = `${newUrl}/${currentUrlPart}`;
				}
			}
			goto(newUrl);
		}
	}
</script>

<div
	class="flex justify-between p-2 rounded-xl border border-gray-300 bg-gray-100 overflow-y-scroll min-h-max "
>
	<button
		class="text-sm hover:bg-gray-200 max-w-max p-2 rounded-lg hover:cursor-pointer flex gap-1 items-center"
		on:click={goBack}
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
