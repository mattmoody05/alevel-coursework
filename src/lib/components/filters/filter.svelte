<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function onClick() {
		dispatch('click');
	}
</script>

<button on:click={onClick}>
	<div class="bg-gray-100 border border-gray-300 rounded-xl text-sm py-2 px-4 hover:opacity-50">
		<div class="flex gap-2 items-center">
			<i class="fa-solid fa-filter" />
			<span>Filter</span>
		</div>
	</div>
</button>
