<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Textbox } from '$lib/components/input';
	import { TwoWayMessage } from '$lib/components/messages';
	import { afterUpdate } from 'svelte';
	import type { messageSummary, twoWayMessage } from '$lib/util/types';
	import type { PageData } from './$types';

	export let data: PageData;
	export let isOwnerChatting: boolean;
	let chattingWith: string = 'Tracey';

	let textboxContent: string = '';
	let conversationViewElement: HTMLElement;

	async function pushMessage() {
		if (textboxContent !== '') {
			const res = await fetch('/api/two-way-message/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					messageContent: textboxContent
				})
			});
			const newMessage: twoWayMessage = await res.json();
			data.messages = [...data.messages, newMessage];
		}
		textboxContent = '';
	}
	function scrollToBottom(element: HTMLElement) {
		element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
	}
	function handleKeyPress(ev: KeyboardEvent) {
		// Checks if the pressed key is the enter key
		if (ev.keyCode === 13) {
			pushMessage();
		}
	}

	afterUpdate(() => {
		scrollToBottom(conversationViewElement);
	});
</script>

<svelte:head>
	<title>Two way messaging: {chattingWith}</title>
</svelte:head>

<div class="flex justify-between flex-col h-full">
	<div id="chatting-with-banner">
		<h3 class="font-bold text-xl">Two way messaging</h3>
		<span class="font-bold">Chatting with: </span> <span>{chattingWith}</span>
	</div>
	<div
		id="messages"
		class="flex flex-col overflow-y-scroll h-full"
		bind:this={conversationViewElement}
	>
		<div class="h-full" />
		{#each data.messages as message}
			<TwoWayMessage messageStyle={message.fromOwner ? 'incoming' : 'outgoing'}>
				{message.messageContent}
			</TwoWayMessage>
		{/each}
	</div>
	<!-- Fix weird border cut off issue with below -->
	<!-- for time being margin has been added -->
	<div id="lower-buttons" class="m-0.5">
		<div class="flex gap-4 mt-4 h-max">
			<div class="w-full" on:keypress={handleKeyPress}>
				<Textbox
					bind:value={textboxContent}
					name="messageContent"
					placeholderText="Type a message..."
				/>
			</div>
			<div class="min-w-max w-32">
				<Button on:click={pushMessage}>Send</Button>
			</div>
		</div>
	</div>
</div>
