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

<div class="flex w-screen h-screen">
	<div class="p-4 pr-0">
		<Menu />
	</div>
	<div class="w-full h-screen p-4 overflow-y-scroll relative">
		{#if selectedRouteUrl !== '/'}
			<div class="flex flex-col gap-4 h-full">
				<Header />
				<div class="h-full overflow-y-scroll">
					<slot />
				</div>
			</div>
		{:else}
			<slot />
		{/if}
	</div>
</div>
