<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function onClickDispatcher() {
		dispatch('click');
	}
</script>

<button
	on:click={onClickDispatcher}
	class="bg-gray-900 max-w-max text-white font-bold py-3 px-8 rounded-2xl"
>
	<slot />
</button>
