<script lang="ts">
	type buttonStyle = 'primary' | 'secondary' | 'danger';

	export let style: buttonStyle = 'primary';
	export let href: string;
</script>

{#if style === 'primary'}
	<a {href}>
		<div
			class="bg-gray-900 hover:bg-gray-700 min-w-max text-white font-bold py-3 px-8 rounded-xl w-full"
		>
			<slot />
		</div>
	</a>
{:else if style === 'secondary'}
	<a {href}>
		<div class="min-w-max opacity-50 underline">
			<slot />
		</div>
	</a>
{:else if style === 'danger'}
	<a {href}>
		<div
			class="bg-red-700 hover:bg-red-600 min-w-max text-white font-bold py-3 px-8 rounded-xl w-full"
		>
			<slot />
		</div>
	</a>
{/if}
