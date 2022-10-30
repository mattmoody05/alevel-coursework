<script lang="ts">
	type page = {
		iconClass: string;
		url: string;
		menuName: string;
	};
	import MenuItem from './menuItem.svelte';
</script>

<div
	class="flex flex-col h-full justify-between p-4 rounded-xl w-max border border-gray-300 bg-gray-100"
>
	<div class="flex flex-col gap-1">
		<MenuItem itemName="Dashboard" iconClass="fa-solid fa-gauge" selected={true} />
		<MenuItem itemName="Messaging" iconClass="fa-solid fa-message" />
		<MenuItem itemName="Invoicing" iconClass="fa-solid fa-receipt" />
		<MenuItem itemName="Absence" iconClass="fa-solid fa-thermometer" />
		<MenuItem itemName="Sessions" iconClass="fa-solid fa-calendar-days" />
		<MenuItem itemName="Recurring sessions" iconClass="fa-solid fa-recycle" />
		<MenuItem itemName="Surveys" iconClass="fa-solid fa-square-poll-vertical" />
		<MenuItem itemName="Registration" iconClass="fa-solid fa-pen" />
		<MenuItem itemName="Time off" iconClass="fa-solid fa-calendar-xmark" />
		<MenuItem itemName="Expenses" iconClass="fa-solid fa-money-bill" />
	</div>
	<MenuItem itemName="Logout" iconClass="fa-solid fa-right-from-bracket" />
</div>
