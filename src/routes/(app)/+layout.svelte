<script lang="ts">
	import { Header } from '$lib/components/header';
	import { Menu } from '$lib/components/menu';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	// The current route that the user is viewing
	let selectedRouteUrl: string = $page.url.pathname;

	// Will run after every navigation event
	afterNavigate(() => {
		selectedRouteUrl = `/${$page.url.pathname.split('/')[1]}`;
	});
</script>

<div class="flex w-screen h-screen">
	<div class="p-4 pr-0">
		<Menu {selectedRouteUrl} isAdmin={data.isAdmin} />
	</div>
	<div class="w-full h-screen p-4 overflow-y-scroll">
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
