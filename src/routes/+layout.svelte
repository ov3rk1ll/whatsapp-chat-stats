<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';

	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="grid grid-rows-[auto_1fr_auto] w-full max-w-(--breakpoint-xl) mx-auto">
	<header class="py-2 my-4 text-white grid grid-cols-[1fr_auto]">
		<p class="text-3xl font-semibold">WhatsApp Chat Stats</p>
		<nav class="flex gap-2">
			<button
				class="btn"
				onclick={() => {
					window.location.href = page.url.toString();
				}}>Start over</button
			>
			<a class="btn" href="#">About</a>
		</nav>
	</header>
	<main
		class="dark:bg-surface-900 mx-auto min-h-[600px] w-full max-w-(--breakpoint-xl) bg-white p-2 lg:px-16 lg:py-8"
	>
		{@render children()}
	</main>
</div>
