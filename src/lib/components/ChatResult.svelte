<script lang="ts">
	import type { Chat } from '$lib/chat.svelte';
	import { countDaysBetweenDates, formatNames } from '$lib/helper';
	import type { stringify } from 'querystring';
	import AuthorShareChart from './AuthorShareChart.svelte';
	import BarChart from './BarChart.svelte';
	import DayLineChart from './DayLineChart.svelte';
	import EmojiCloudChart from './EmojiCloudChart.svelte';
	import RadarChart from './RadarChart.svelte';
	import RenameAuthor from './RenameAuthor.svelte';
	import WordCloudChart from './WordCloudChart.svelte';
	import WordPodium from './WordPodium.svelte';

	const { chat }: { chat: Chat } = $props();

	const days = $derived(
		countDaysBetweenDates(chat.getMessages().at(0)!.date, chat.getMessages().at(-1)!.date)
	);

	let wordCloudTheme = $state('random-square-white');

	function changeAuthor(k: string, v: string) {
		chat.authorNameMap[k] = v;
	}

	type StringMap = Record<string, string>;
</script>

{#snippet nameList(names: string[], map: StringMap)}
	{#if names.length === 1}
		<RenameAuthor key={names[0]} {map} onchange={changeAuthor} />
	{:else if names.length === 2}
		<RenameAuthor key={names[0]} {map} onchange={changeAuthor} /> and <RenameAuthor
			key={names[1]}
			{map}
			onchange={changeAuthor}
		/>
	{:else if names.length > 2}
		{#each names as name, idx}
			{#if idx > 0 && idx < names.length - 1},&nbsp;{:else if idx === names.length - 1}&nbsp;and&nbsp;{/if}<RenameAuthor
				key={name}
				{map}
				onchange={changeAuthor}
			/>
		{/each}
	{/if}
{/snippet}

<section>
	<p class="text-3xl text-balance">
		{@render nameList(chat.getAuthors(), chat.authorNameMap)} wrote {chat.getMessages().length} messages
		between
		{chat.getMessages().at(0)?.date.toLocaleDateString()} and {chat
			.getMessages()
			.at(-1)
			?.date.toLocaleDateString()}.<br />In {days} days, they wrote {chat.totalWordCount} words and used
		{chat.totalEmojiCount}
		emojis
	</p>
</section>
<section class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
	<div class="lg:col-span-2">
		<DayLineChart data={chat.getLineGraphData()} />
	</div>
	<div>
		<AuthorShareChart {chat} />
	</div>
	<div><BarChart {chat} dataGrouping="hourly" /></div>
	<div><RadarChart {chat} dataGrouping="monthly" title="Messages per month" /></div>
	<div><RadarChart {chat} dataGrouping="weekday" title="Messages per weekday" /></div>

	<div class="lg:col-span-2 flex flex-col">
		<WordCloudChart {chat} theme={wordCloudTheme} />
		<select class="select" bind:value={wordCloudTheme}>
			<option value="random-square-white">White</option>
			<option value="random-square-black">Black</option>
			<option value="love">Love</option>
		</select>
	</div>
	<div class="lg:col-span-2">
		<EmojiCloudChart {chat} />
	</div>
</section>
<hr class="bg-wa-2 border-0 my-8 h-0.5" />
<section class="divide-wa-2 divide-y-2 grid grid-cols-1 gap-4">
	{#each [...chat.getAuthors(), 'all'] as author}
		<article class="border-2 border-gray-500">
			<div class="flex flex-row items-baseline p-4 bg-gray-300">
				<h2 class="text-5xl">{chat.authorNameMap[author] || author}</h2>
				<span class="text-2xl opacity-60">
					&nbsp;sent {chat.getMessagesBy(author).length} messages</span
				>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
				<div>
					<h3 class="text-3xl mt-4">Most used emoji</h3>
					<WordPodium
						words={chat.getEmojiCount(author).slice(0, 3)}
						textClass="text-5xl sm:text-8xl"
					/>
				</div>
				<div>
					<h3 class="text-3xl mt-4">Most used words</h3>
					<WordPodium
						words={chat.getWordCount(author).slice(0, 3)}
						textClass="text-xl sm:text-2xl"
					/>
				</div>
			</div>

			<p>Longest message: {chat.longestMessage[author]?.count}</p>
		</article>
	{/each}
</section>

<style lang="postcss">
	@reference "tailwindcss";
	.select {
		@apply appearance-none bg-slate-100 py-2 pr-10 pl-2 text-slate-950;
		print-color-adjust: exact;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='oklch(55.1%25 0.027 264.364)' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 0.5rem center;
		background-repeat: no-repeat;
		background-size: 1.5em 1.5em;
	}
</style>
