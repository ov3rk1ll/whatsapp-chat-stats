<script lang="ts">
	const {
		key,
		map = $bindable(),
		onchange
	}: {
		key: string;
		map: Record<string, string>;
		onchange: (k: string, v: string) => void;
	} = $props();

	let edit = $state(false);
	let value = $derived(map[key] ?? key);
</script>

{#if edit}
	<div class="relative inline-block">
		<input
			type="text"
			bind:value
			class="block w-full px-1 py-3 border text-heading text-sm rounded-md shadow-xs"
			required
		/>
		<button
			type="button"
			class="cursor-pointer absolute end-1.5 bottom-1.5 text-white bg-wa-1 hover:brightness-105 box-border border border-transparent focus:ring-4 shadow-xs font-medium leading-5 rounded-md text-xs px-3 py-1.5 focus:outline-none"
			onclick={() => {
				onchange(key, value);
				edit = false;
			}}>Done</button
		>
	</div>
{:else}
	<button
		type="button"
		class="underline cursor-pointer"
		onclick={() => {
			edit = true;
		}}>{map[key] ?? key}</button
	>
{/if}
