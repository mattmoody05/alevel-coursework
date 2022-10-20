<script lang="ts">
	type buttonStyle = 'primary' | 'secondary';

	export let style: buttonStyle = 'primary';
	export let href: string;
</script>

{#if style === 'primary'}
	<a {href}>
		<div class="bg-gray-900 hover:bg-gray-700 max-w-max text-white font-bold py-3 px-8 rounded-2xl">
			<slot />
		</div>
	</a>
{:else}
	<a {href}>
		<div class="max-w-max opacity-50 underline">
			<slot />
		</div>
	</a>
{/if}
