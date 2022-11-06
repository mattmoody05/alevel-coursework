<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import { Menu } from '$lib/components/menu';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';

	let selectedRouteUrl: string = $page.url.pathname;
	afterNavigate(() => {
		selectedRouteUrl = `/${$page.url.pathname.split('/')[1]}`;
	});
</script>

<div class="flex p-4 w-screen h-screen">
	<Menu />
	<div class="ml-4 w-full overflow-y-scroll">
		{#if selectedRouteUrl !== '/'}
			<Header />
			<div class="mt-4">
				<slot />
			</div>
		{:else}
			<slot />
		{/if}
	</div>
</div>
