<script lang="ts">
	export let href: string;
</script>

<a {href}>
	<div class="bg-gray-900 max-w-max text-white font-bold py-3 px-8 rounded-2xl">
		<slot />
	</div>
</a>
