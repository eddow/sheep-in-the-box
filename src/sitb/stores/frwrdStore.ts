import type { Readable, Subscriber, Unsubscriber, Writable } from "svelte/store";

export function frwrdReadable<T>(source: ()=> Readable<T>) : Readable<T> {
	return {
		subscribe(run: Subscriber<T>, invalidate?: (value?: T) => void): Unsubscriber {
			return source().subscribe((value: T)=> {
				run(value);
			}, invalidate && ((value?: T) => { invalidate(value); }));
		}
	}
}

export function frwrdWritable<T = any>(source: ()=> Writable<T>) : Writable<T> {
	return {
		...frwrdReadable<T>(source),
		set(value) {
			source().set(value);
		},
		update(updater) {
			source().update(updater);
		}
	};
}
