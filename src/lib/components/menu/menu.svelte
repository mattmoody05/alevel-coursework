<script lang="ts">
	import { goto } from '$app/navigation';
	import { MenuItem } from '$lib/components/menu';
	import { routes } from '$lib/util/routes';
	import { page } from '$app/stores';

	export let selectedRouteUrl: string = $page.url.pathname;
	export let isAdmin: boolean = false;

	function logout() {
		// goto() function not used here as prefetching causes issues with cookies
		// Navigates to the logout page
		window.location.href = '/logout';
	}
</script>

<div
	class="flex flex-col h-full justify-between p-2 rounded-xl min-w-max border border-gray-300 bg-gray-100 overflow-y-scroll"
>
	<div class="flex flex-col gap-1">
		{#each routes as route}
			<!-- Filters the menu items show by the current user type -->
			{#if route.adminOnly}
				{#if isAdmin}
					<MenuItem
						itemName={route.name}
						iconClass={route.iconClass}
						on:click={() => goto(route.url)}
						selected={selectedRouteUrl === route.url}
					/>
				{/if}
			{:else}
				<MenuItem
					itemName={route.name}
					iconClass={route.iconClass}
					on:click={() => goto(route.url)}
					selected={selectedRouteUrl === route.url}
				/>
			{/if}
		{/each}
	</div>
	<MenuItem itemName="Logout" iconClass="fa-solid fa-right-from-bracket" on:click={logout} />
</div>
