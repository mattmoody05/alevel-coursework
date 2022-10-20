<script lang="ts">
	export let placeholderText: string = 'placehodlers';
	export let labelText: string = 'First name';
	export let textboxContent: string = '';
</script>

<div class="flex flex-col-reverse gap-1">
	<input
		type="text"
		id="componentTextbox"
		class="peer bg-gray-100 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
		placeholder={placeholderText}
		bind:value={textboxContent}
	/>
	<label for="componentTextbox" class="text-sm">{labelText}</label>
</div>
