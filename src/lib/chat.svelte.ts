import { parseString, type Message } from 'whatsapp-chat-parser';
import stopwords_de from "stopwords-de";
import stopwords from "stopwords-en";
import emojiRegex from 'emoji-regex';
import moment from 'moment';
import { SvelteSet } from 'svelte/reactivity';

export interface WordCount {
    word: string;
    count: number;
}

export class Chat {
    private static emojiRegex = emojiRegex();
    private static STOP_WORDS = [...stopwords_de, ...stopwords, '(Datei', 'angehängt)',
        'is', 'eh', 'ned', 'ok', 'ma', 'net', '<medien', 'ausgeschlossen>',
        'hahaha', 'haha', 'hahahaha', 'gehts'
    ];

    private messages: Message[] = [];
    private authors: string[] = [];

    private authorMessagesCache: Record<string, Message[]> = {};

    private _totalWordCount = 0;
    private _totalEmojiCount = 0;

    private wordCount: Record<'all' | string, Record<string, number>> = { 'all': {} };
    private emojiCount: Record<'all' | string, Record<string, number>> = { 'all': {} };

    public longestMessage: Record<string, WordCount> = {};

    public authorNameMap = $state<Record<string, string>>({});

    public constructor(text: string | undefined = undefined) {
        if (text) {
            const startTime = performance.now();
            const messages = parseString(text).filter(m => !!m.author);
            if (messages.length === 0) {
                throw new Error("No messages in chat");
            }

            const authors: Set<string> = new SvelteSet();
            for (const m of messages) {
                if (m.message.startsWith('\u200e')) {
                    continue;
                }
                this.evaluateMessage(m);
                if (m.author) {
                    authors.add(m.author);
                }
            }

            this.messages = messages;
            this.authors = Array.from(authors);

            const endTime = performance.now();
            console.log(`Parsing took ${endTime - startTime} milliseconds`);
        }
    }

    private evaluateMessage(message: Message) {
        if (!this.wordCount[message.author!]) {
            this.wordCount[message.author!] = {};
        }
        if (!this.emojiCount[message.author!]) {
            this.emojiCount[message.author!] = {};
        }

        if (!this.longestMessage[message.author!]) {
            this.longestMessage[message.author!] = { word: message.message, count: message.message.length };
        } else if (message.message.length > this.longestMessage[message.author!].count) {
            this.longestMessage[message.author!] = { word: message.message, count: message.message.length };
        }

        const content = message.message
            .replaceAll('☺', '☺️');

        const emoji = content.match(Chat.emojiRegex);

        const words = content
            .replace(Chat.emojiRegex, '')
            .replace(/\r\n/g, " ")
            .replace(/\n/g, " ")
            .replace(/[.!,-:?'/]/g, '')
            .split(" ")
            .map(w => w.trim().toLowerCase())
            .filter(w => w.length > 1);
        for (const w of words) {
            if (w.length <= 0 || w === '' || Chat.STOP_WORDS.includes(w) || Chat.STOP_WORDS.includes(w.toLowerCase())) {
                continue;
            }

            this._totalWordCount += 1;
            this.wordCount['all'][w] = (this.wordCount['all'][w] || 0) + 1;
            this.wordCount[message.author!][w] = (this.wordCount[message.author!][w] || 0) + 1;
        }

        if (emoji) {
            for (const w of emoji) {
                if (w.length === 0) {
                    continue;
                }

                this._totalEmojiCount += 1;
                this.emojiCount['all'][w] = (this.emojiCount['all'][w] || 0) + 1;
                this.emojiCount[message.author!][w] = (this.emojiCount[message.author!][w] || 0) + 1;
            }
        }
    }

    public getMessages(): Message[] {
        return this.messages;
    }

    public getAuthors(): string[] {
        return this.authors;
    }

    public getMessagesBy(author: string): Message[] {
        if (author === 'all') {
            return this.messages;
        }

        if (this.authorMessagesCache[author]) {
            return this.authorMessagesCache[author];
        }

        this.authorMessagesCache[author] = this.messages.filter(m => m.author === author);
        return this.authorMessagesCache[author];
    }

    public getWordCount(author: string, minOccurrence: number = 0): WordCount[] {
        console.log('getWordCount', author, minOccurrence);
        if (!this.wordCount[author]) {
            return [];
        }

        return Object.entries(this.wordCount[author])
            .map(([w, c]) => ({ word: w, count: c }))
            .filter(w => w.count > minOccurrence)
            .sort((a, b) => b.count - a.count);
    }

    public getEmojiCount(author: string, minOccurrence: number = 0): WordCount[] {
        if (!this.emojiCount[author]) {
            return [];
        }

        return Object.entries(this.emojiCount[author])
            .map(([w, c]) => ({ word: w, count: c }))
            .filter(w => w.count > minOccurrence)
            .sort((a, b) => b.count - a.count);;
    }

    get totalWordCount() {
        return this._totalWordCount;
    }

    public getUniqueEmoji() {
        const set = new SvelteSet();
        Object.entries(this.emojiCount['all']).forEach(([w]) => { set.add(w); });
        return Array.from(set);
    }

    get totalEmojiCount() {
        return this._totalEmojiCount;
    }

    public getLineGraphData() {
        const getDaysArray = function (s: Date, e: Date) {
            const initDateDict: Record<string, number> = {};
            for (let m = moment(s); m.isBefore(e); m.add(1, "days")) {
                initDateDict[m.format("YYYY-MM-DD")] = 0;
            }
            return initDateDict;
        };

        const daysDict = getDaysArray(this.messages.at(0)!.date, this.messages.at(-1)!.date);
        this.messages.forEach(message => {

            daysDict[moment(message.date).format("YYYY-MM-DD")] += 1;
        });

        return daysDict;
    }

    public getHourlyData(author: string) {
        const sections = new Array(24).fill(0);
        this.getMessagesBy(author).map((message) => {
            sections[message.date.getHours()] += 1;
        });
        return sections;
    }

    public getMonthlyData(author: string) {
        const sections = new Array(12).fill(0);
        this.getMessagesBy(author).map((message) => {
            sections[message.date.getMonth()] += 1;
        });
        return sections;
    }

    public getWeekdayData(author: string) {
        const sections = new Array(7).fill(0);
        this.getMessagesBy(author).map((message) => {
            sections[message.date.getDay()] += 1;
        });
        return sections;
    }

}