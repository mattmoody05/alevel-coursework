<script lang="ts">
	import { Textbox, Listbox } from '$lib/components/inputs';
	import { Button } from '$lib/components/button';
</script>

<div class="m-12">
	<Listbox labelText="Select child" placeholderOption="Please select child">
		<option value="A">Alex</option>
		<option value="O">Oliver</option>
		<option value="J">James</option>
	</Listbox>
	<br />
	<Textbox labelText="First name" placeholderText="Jon" />
</div>
