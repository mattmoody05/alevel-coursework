<script lang="ts">
	type twoWayMessageType = 'incoming' | 'outgoing';
	export let messageStyle: twoWayMessageType;
</script>

{#if messageStyle === 'incoming'}
	<div class="flex justify-start mt-4 ">
		<div class="max-w-[75%] p-2.5 rounded-xl bg-gray-100 border border-gray-300">
			<slot />
		</div>
	</div>
{:else if messageStyle === 'outgoing'}
	<div class="flex justify-end mt-4">
		<div
			class="max-w-[75%] from-indigo-700 to-indigo-500 bg-gradient-to-tl text-white p-2.5 rounded-xl"
		>
			<slot />
		</div>
	</div>
{/if}
