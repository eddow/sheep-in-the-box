import { browser } from '$app/environment';
import noduleNames from '$lib/nodules';
import { writable } from 'svelte/store';
import type { Role, Roles } from './constants';
import globic from './globic';

const noduleTypes = {
	menu: (m: string)=> import(`../nodules/${m}/+menu.svelte`),
	server: (m: string)=> import(`../nodules/${m}/+menu.ts`)
} as const;

export type NoduleType = keyof typeof noduleTypes;
export async function importNodules<T=any>(part: NoduleType, roles: Roles): Promise<Record<string, T>> {
	if(browser && part !== 'menu') throw new Error('Only the nodules menu items can be imported in the browser');
	return Object.fromEntries(await Promise.all(
		noduleNames[part]
			.filter((m)=> m.split('/').every((x)=> !x.startsWith('@') || roles[<Role>x.slice(1)]))
			.map(async m=> [m, <T>await noduleTypes[part](m)])
		));
}

export const nodulesData = globic(()=> writable<any>());