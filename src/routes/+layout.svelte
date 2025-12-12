<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main
	class="dark:bg-surface-900 mx-auto min-h-[600px] w-full max-w-(--breakpoint-xl) bg-white p-2 lg:px-16 lg:py-8 mt-8"
>
	{@render children()}
</main>
