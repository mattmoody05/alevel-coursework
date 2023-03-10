<script lang="ts">
	export let style: 'primary' | 'secondary' | 'danger' | 'submit' = 'primary';
	export let formaction: string | undefined = undefined;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let styleClasses = '';

	// Changing the styling of the button based on the style type selected
	if (style === 'primary') {
		styleClasses = 'bg-gray-900 hover:bg-gray-700 text-white font-bold p-3 rounded-xl w-full';
	} else if (style === 'secondary') {
		styleClasses = 'opacity-50 underline';
	} else if (style === 'danger') {
		styleClasses = 'bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl w-full';
	}
</script>

{#if style === 'submit'}
	<button
		class="bg-gray-900 hover:bg-gray-700 min-w-max text-white font-bold p-3 rounded-xl w-full"
		type="submit"
		{formaction}
	>
		<slot />
	</button>
{:else}
	<button on:click={() => dispatch('click')} class="min-w-max {styleClasses}" {formaction}>
		<slot />
	</button>
{/if}
