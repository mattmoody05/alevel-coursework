<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h3 class="font-bold text-xl mb-2">Two way messaging</h3>
{#if data.isAdmin === true}
	<div class="flex flex-col gap-2">
		{#each data.latestMessages as message}
			<a href="/messaging/two-way/chat?admin-parent-id={message.parent.parentId}">
				<div
					class="bg-gray-100 border border-gray-300 rounded-xl p-4 flex justify-between items-center"
				>
					<div class="flex flex-col">
						<span class="font-bold">{message.parent.firstName}</span>
						<span class="opacity-50"
							>{message.latestMessage !== undefined
								? message.latestMessage.messageContent
								: ''}</span
						>
					</div>
					<div><i class="fa-solid fa-chevron-right opacity-50 pr-2" /></div>
				</div>
			</a>
		{/each}
	</div>
{:else}
	<a href="/messaging/two-way/chat">
		<div
			class="bg-gray-100 border border-gray-300 rounded-xl p-4 flex justify-between items-center"
		>
			<div class="flex flex-col">
				<span class="font-bold">Chat with Admin</span>
				<span class="opacity-50"
					>{data.latestMessage !== undefined ? data.latestMessage.messageContent : ''}</span
				>
			</div>
			<div><i class="fa-solid fa-chevron-right opacity-50 pr-2" /></div>
		</div>
	</a>
{/if}
