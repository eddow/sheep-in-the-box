import type { Language, TextType } from '$sitb/constants';

export interface DictionaryEntry extends Record<Language, string> {
	key: string;
	type: TextType;
}