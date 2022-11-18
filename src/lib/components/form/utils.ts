import { assertNnull } from '$lib/utils';
import type { Form, Paths, KnownStores, KnownHelpers } from '@felte/core';
import { getContext, setContext } from 'svelte';

const formContext = {};

type Obj = Record<string, any>;
export type FormAction = (node: HTMLFormElement) => {
    destroy: () => void;
};
export type FormContext<Data extends Obj = any> = Form<Data> & KnownHelpers<Data, Paths<Data>> & KnownStores<Data>;
export function setFrmCtx<T extends FormContext = FormContext>(c: T) { setContext(formContext, c); }
export function getFrmCtx<T extends FormContext = FormContext>(): T {
	return assertNnull(getContext<T>(formContext), 'Element in a form');
}