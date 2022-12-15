<script lang="ts">
	export let labelText: string = '';
	export let files: FileList | undefined = undefined;
	export let name: string = '';
	export let accept: string = '.jpg,.png';
</script>

<div class="flex flex-col gap-1">
	{#if labelText !== ''}
		<label for="componentFileUpload" class="text-sm">{labelText}</label>
	{/if}
	<input
		class=" w-full focus:outline-none {files === undefined
			? 'text-gray-500'
			: ''} border border-gray-300 rounded-xl cursor-pointer file:bg-gray-900 file:text-white file:border-none file:py-2 file:px-4 p-1.5 file:mr-2.5 file:font-medium file:rounded-lg bg-gray-100"
		id="componentFileUpload"
		type="file"
		{accept}
		{name}
		bind:files
	/>
</div>
