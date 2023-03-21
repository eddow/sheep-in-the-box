import type { Language, TextType } from '$lib/constants';

export interface DictionaryEntry extends Record<Language, string> {
	key: string;
	type: TextType;
}