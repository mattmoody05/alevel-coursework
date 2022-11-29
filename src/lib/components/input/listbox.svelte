<script lang="ts">
	export let placeholderOption: string = 'Select';
	export let labelText: string = '';
	export let value: string = 'default';
	export let name: string = '';
</script>

<div class="flex flex-col gap-1">
	{#if labelText !== ''}
		<label for="componentListbox" class="text-sm">{labelText}</label>
	{/if}
	<select
		id="componentListbox"
		class="bg-gray-100 border border-gray-300 rounded-xl block w-full p-2.5 {value === 'default'
			? 'text-gray-500'
			: ''}"
		bind:value
		{name}
	>
		<option selected value="default">{placeholderOption}</option>
		<slot />
	</select>
</div>
