<script lang="ts">
	type buttonStyle = 'primary' | 'secondary' | 'danger';

	export let style: buttonStyle = 'primary';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function onClickDispatcher() {
		dispatch('click');
	}
</script>

{#if style === 'primary'}
	<button
		on:click={onClickDispatcher}
		class="bg-gray-900 hover:bg-gray-700 max-w-max text-white font-bold py-3 px-8 rounded-2xl"
	>
		<slot />
	</button>
{:else if style === 'secondary'}
	<button on:click={onClickDispatcher} class="max-w-max opacity-50 underline">
		<slot />
	</button>
{:else if style === 'danger'}
	<button
		on:click={onClickDispatcher}
		class="bg-red-700 hover:bg-red-600 max-w-max text-white font-bold py-3 px-8 rounded-2xl"
	>
		<slot />
	</button>
{/if}
