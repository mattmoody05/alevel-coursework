<script lang="ts">
	import { Button } from '$lib/components/button';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let title: string;
	export let body: string;
	export let buttonText: string;
	export let secondaryButtonText: string = '';
</script>

<div class="bg-gray-100 p-4 m-4 rounded-2xl max-w-2xl">
	<h1 class="font-bold text-2xl">{title}</h1>
	<p class="opacity-50 leading-5">{body}</p>
	<div class="flex flex-col-reverse items-center gap-2 mt-4 md:flex-row md:justify-between">
		{#if secondaryButtonText !== ''}
			<Button on:click={() => dispatch('secondary-click')} style="secondary"
				>{secondaryButtonText}</Button
			>
		{/if}
		<div class="w-64">
			<Button on:click={() => dispatch('primary-click')} style="primary">{buttonText}</Button>
		</div>
	</div>
</div>
