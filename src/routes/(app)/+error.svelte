<script lang="ts">
	import { page } from '$app/stores';

	let showMessage: boolean = true;

	function toggleShowMessage() {
		showMessage = !showMessage;
	}
</script>

{#if $page.status === 500}
	<!-- Internal server error  -->
	<h3 class="font-bold text-xl">Error {$page.status} - Internal server error</h3>
	Oops! Something went wrong on our end, but we aren't quite sure what. Please try again later, or contact
	an admin to get it sorted now!
{:else if $page.status === 400}
	<!-- Bad request -->
	<h3 class="font-bold text-xl">Error {$page.status} - Bad request</h3>
	Oops! That was a bad request on your end. Please try again later, or contact an admin to get it sorted
	now!
{:else if $page.status === 401}
	<!-- Unauthorised -->
	<h3 class="font-bold text-xl">Error {$page.status} - Unauthorised</h3>
	Oops! You are not currently logged in. Please go to the login page and enter your login details to
	gain access to this page. If you are still having issues please try again later, or contact and admin
	to get it sorted now!
{:else if $page.status === 403}
	<!-- Forbidden -->
	<h3 class="font-bold text-xl">Error {$page.status} - Forbidden</h3>
	Oops! Your user account is not able to access this part of the system. If you don't think this is right,
	please try again later, or contact an admin to get it sorted now!
{:else if $page.status === 404}
	<!-- Not found -->
	<h3 class="font-bold text-xl">Error {$page.status} - Not found</h3>
	Oops! The page that you are looking for can't be found, it might be that the item you are looking for
	does not exist anymore. Please try against later, or contact an admin to get it sorted now!
{:else}
	<h3 class="font-bold text-xl">Error {$page.status}</h3>
	Oops! We don't know what happened here. Please try again later, or contact an admin to get it sorted
	now!
{/if}

<div class="py-4">
	<button on:click={toggleShowMessage} class="opacity-50 text-sm">
		<i class="fa-solid fa-arrow-{showMessage ? 'up' : 'down'}" /> View {showMessage
			? 'less'
			: 'more'}
	</button>
</div>

{#if showMessage}
	{#if $page.error}
		<div class="text-sm opacity-50 flex flex-col gap-2§">
			<span><span class="font-bold">Pathname:</span> {$page.url.pathname}</span>
			<span
				><span class="font-bold">Account type:</span>
				{$page.data.isAdmin ? 'Admin' : 'Parent'}</span
			>
			<span><span class="font-bold">Message:</span> {$page.error.message}</span>
		</div>
	{/if}
{/if}
