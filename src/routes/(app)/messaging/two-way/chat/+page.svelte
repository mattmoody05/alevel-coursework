<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Textbox } from '$lib/components/input';
	import { TwoWayMessage } from '$lib/components/messages';
	import { afterUpdate, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import type { twoWayMessage } from '$lib/util/types';

	export let data: PageData;

	let textboxContent: string = '';
	let conversationViewElement: HTMLElement;

	function scrollToBottom(element: HTMLElement) {
		element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
	}

	afterUpdate(() => {
		scrollToBottom(conversationViewElement);
	});

	onMount(() => {
		// Polling the server every 10 seconds in order to keep the messages up to date
		// Not an efficient way of doing this
		// Possibly use websockets in future - come back to this
		const getMessagesInterval = setInterval(async () => {
			if (data.isAdmin) {
				const request = await fetch(`/api/two-way-message/get?admin-parent-id=${data.parentId}`);
				const messages: twoWayMessage[] = await request.json();
				data.messages = messages;
			} else {
				const request = await fetch(`/api/two-way-message/get`);
				const messages: twoWayMessage[] = await request.json();
				data.messages = messages;
			}
		}, 10000);
		return () => {
			clearInterval(getMessagesInterval);
		};
	});
</script>

<svelte:head>
	<title>Two way messaging: {data.chattingWith}</title>
</svelte:head>

<div class="flex justify-between flex-col h-full">
	<div id="chatting-with-banner">
		<h3 class="font-bold text-xl">Two way messaging</h3>
		<span class="font-bold">Chatting with: </span> <span>{data.chattingWith}</span>
	</div>
	<div
		id="messages"
		class="flex flex-col overflow-y-scroll h-full"
		bind:this={conversationViewElement}
	>
		<div class="h-full" />
		{#each data.messages as message}
			{#if data.isAdmin}
				<TwoWayMessage messageStyle={message.fromOwner ? 'outgoing' : 'incoming'}>
					{message.messageContent}
				</TwoWayMessage>
			{:else}
				<TwoWayMessage messageStyle={message.fromOwner ? 'incoming' : 'outgoing'}>
					{message.messageContent}
				</TwoWayMessage>
			{/if}
		{/each}
	</div>
	<!-- Fix weird border cut off issue with below -->
	<!-- for time being margin has been added -->
	<div id="lower-buttons" class="m-0.5">
		<form use:enhance method="POST" class="flex gap-4 mt-4 h-max">
			<div class="w-full">
				<Textbox
					bind:value={textboxContent}
					name="messageContent"
					placeholderText="Type a message..."
				/>
			</div>
			<div class="min-w-max w-32">
				<Button style="submit">Send</Button>
			</div>
		</form>
	</div>
</div>
