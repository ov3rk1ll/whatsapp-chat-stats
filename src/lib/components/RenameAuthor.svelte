<script lang="ts">
	import CheckIcon from 'lucide-svelte/icons/check';

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
	<div class="input-group grid-cols-[1fr_auto] inline-grid">
		<input class="ig-input" type="text" bind:value />
		<button
			class="ig-btn preset-filled-primary-500"
			onclick={() => {
				onchange(key, value);
				edit = false;
			}}
		>
			<CheckIcon size={16} />
		</button>
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
