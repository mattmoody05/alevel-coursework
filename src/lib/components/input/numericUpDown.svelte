<script lang="ts">
	export let placeholderText = '';
	export let labelText: string = '';
	export let value: number = 0;
	export let name: string = '';
</script>

<div class="flex flex-col gap-1">
	{#if labelText !== ''}
		<label for="componentListbox" class="text-sm">{labelText}</label>
	{/if}
	<input
		type="number"
		id="componentTextbox"
		class="bg-gray-100 border border-gray-300 rounded-xl block w-full p-3"
		bind:value
		placeholder={placeholderText}
		{name}
	/>
</div>
