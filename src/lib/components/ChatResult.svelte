<script lang="ts">
	import type { Chat } from '$lib/chat';
	import { countDaysBetweenDates, formatNames } from '$lib/helper';
	import AuthorShareChart from './AuthorShareChart.svelte';
	import DayLineChart from './DayLineChart.svelte';
	import WordCloudChart from './WordCloudChart.svelte';
	import WordPodium from './WordPodium.svelte';

	const { chat }: { chat: Chat } = $props();

	const mappedAuthors: Record<string, string> = $state({
		'Katrin 🍓 Leitner': 'Katrin',
		all: 'Together'
	});

	const days = $derived(
		countDaysBetweenDates(chat.getMessages().at(0)!.date, chat.getMessages().at(-1)!.date)
	);
</script>

<section>
	<p class="text-3xl text-balance">
		{formatNames(chat.getAuthors().map((x) => mappedAuthors[x] || x))} wrote {chat.getMessages()
			.length} messages between {chat.getMessages().at(0)?.date.toLocaleDateString()} and {chat
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
	<p class="text-2xl font-thin mx-auto text-center">Time of Day</p>
	<p class="text-2xl font-thin mx-auto text-center">Month</p>
	<p class="text-2xl font-thin mx-auto text-center">Weekday</p>

	<div class="lg:col-span-2">
		<WordCloudChart {chat} />
	</div>
</section>
<hr class="bg-[#128c7e] border-0 my-8 h-0.5" />
<section class="divide-[#128c7e] divide-y-2 grid grid-cols-1 gap-4">
	{#each [...chat.getAuthors(), 'all'] as author}
		<article class="border-2 border-gray-500">
			<div class="flex flex-row items-baseline p-4 bg-gray-300">
				<h2 class="text-5xl">{mappedAuthors[author] || author}</h2>
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
