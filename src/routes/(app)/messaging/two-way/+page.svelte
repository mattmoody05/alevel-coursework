<script lang="ts">
	import type { twoWayMessage } from '$lib/util/types';
	import type { PageData } from './$types';

	export let data: PageData;
	function getParentLastMessage(parentId: string): twoWayMessage {
		const matchingMessages = data.latestMessages?.filter(
			(message) => message.parentId === parentId
		);
		// @ts-ignore
		return matchingMessages[0].message;
	}
</script>

{#if data.isAdmin}
	<div class="flex flex-col gap-2">
		{#each data.parents as parent}
			<a href="/messaging/two-way/chat?admin-parent-id={parent.parentId}">
				<div
					class="bg-gray-100 border border-gray-300 rounded-xl p-4 flex justify-between items-center"
				>
					<div class="flex flex-col">
						<span class="font-bold">{parent.firstName}</span>
						<span class="opacity-50">{getParentLastMessage(parent.parentId).messageContent}</span>
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
				<span class="opacity-50">{data.latestMessage.messageContent}</span>
			</div>
			<div><i class="fa-solid fa-chevron-right opacity-50 pr-2" /></div>
		</div>
	</a>
{/if}
