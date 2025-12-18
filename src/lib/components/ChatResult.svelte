<script lang="ts">
	import type { Chat } from '$lib/chat.svelte';
	import { countDaysBetweenDates } from '$lib/helper';

	import CheckIcon from 'lucide-svelte/icons/check';
	import PlusIcon from 'lucide-svelte/icons/plus';
	import MinusIcon from 'lucide-svelte/icons/minus';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

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
	let ignoredWords = $state('');
	let _ignoredWords = $state('');

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

	<div class="lg:col-span-2">
		<WordCloudChart {chat} theme={wordCloudTheme} {ignoredWords} />

		<Accordion collapsible>
			<Accordion.Item value="1">
				<h3>
					<Accordion.ItemTrigger class="flex justify-between items-center">
						Wordcloud settings
						<Accordion.ItemIndicator class="group">
							<MinusIcon class="size-4 group-data-[state=open]:block hidden" />
							<PlusIcon class="size-4 group-data-[state=open]:hidden block" />
						</Accordion.ItemIndicator>
					</Accordion.ItemTrigger>
				</h3>
				<Accordion.ItemContent class="space-y-4 border-[1px] border-surface-200-800 rounded-base">
					<div class="input-group grid-cols-[auto_1fr]">
						<div class="ig-cell preset-tonal">Theme</div>
						<select class="ig-select" bind:value={wordCloudTheme}>
							<option value="random-square-white">White</option>
							<option value="random-square-black">Black</option>
							<option value="love">Love</option>
						</select>
					</div>

					<div class="input-group grid-cols-[auto_1fr_auto]">
						<div class="ig-cell preset-tonal">Blocked words</div>
						<input class="ig-input" type="text" bind:value={_ignoredWords} />
						<button
							class="ig-btn preset-filled-primary-500"
							onclick={() => {
								ignoredWords = _ignoredWords;
							}}
						>
							<CheckIcon size={16} />
						</button>
					</div>
				</Accordion.ItemContent>
			</Accordion.Item>
		</Accordion>
	</div>
	<div class="lg:col-span-2">
		<EmojiCloudChart {chat} />
	</div>
</section>
<hr class="bg-secondary-500 border-0 my-8 h-0.5" />
<section class="grid grid-cols-1 gap-4">
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
	@reference "@skeletonlabs/skeleton";
</style>
