<script lang="ts">
	export let placeholderText: string = 'Select';
	export let labelText: string = '';
	export let value: string = '';
	export let allowResize: boolean = false;
</script>

<div class="flex flex-col gap-1">
	{#if labelText !== ''}
		<label for="componentLargeTextbox" class="text-sm">{labelText}</label>
	{/if}
	<textarea
		id="compnentLargeTextbox"
		class="bg-gray-100 border border-gray-300 text-sm rounded-lg block w-full h-32 p-2.5 {allowResize
			? ''
			: 'resize-none'}"
		placeholder={placeholderText}
		bind:value
	/>
</div>
