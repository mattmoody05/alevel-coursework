<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { MenuItem } from '$lib/components/menu';
	import { routes } from '$lib/util/routes';
	import { page } from '$app/stores';
	import { removeCookie } from '$lib/util/cookies';

	export let selectedRouteUrl: string = $page.url.pathname;
	afterNavigate(() => {
		selectedRouteUrl = `/${$page.url.pathname.split('/')[1]}`;
	});

	function logout() {
		removeCookie('token');
		goto('/login');
	}
</script>

<div
	class="flex flex-col h-full justify-between p-2 rounded-xl min-w-max border border-gray-300 bg-gray-100 overflow-y-scroll"
>
	<div class="flex flex-col gap-1">
		{#each routes as route}
			{#if selectedRouteUrl === route.url}
				<MenuItem
					itemName={route.name}
					iconClass={route.iconClass}
					on:click={() => goto(route.url)}
					selected={true}
				/>
			{:else}
				<MenuItem
					itemName={route.name}
					iconClass={route.iconClass}
					on:click={() => goto(route.url)}
				/>
			{/if}
		{/each}
	</div>
	<MenuItem itemName="Logout" iconClass="fa-solid fa-right-from-bracket" on:click={logout} />
</div>
