import type { Readable, Subscriber, Unsubscriber, Writable } from "svelte/store";

export function transReadable<U, S=string|undefined>(source: Readable<S>, read: (stored: S)=> U) : Readable<U> {
	function optRead(value?: S) {
		return value === undefined ? undefined : read(value);
	}
	return {
		subscribe(run: Subscriber<U>, invalidate?: (value?: U) => void): Unsubscriber {
			return source.subscribe((stored: S)=> {
				run(read(stored));
			}, invalidate && ((value?: S) => { invalidate(optRead(value)); }));
		}
	}
}

export function transWritable<U, S=string|undefined>(source: Writable<S>, read: (stored: S)=> U, write: (value: U)=> S) : Writable<U> {
	return {
		...transReadable<U, S>(source, read),
		set(value) {
			source.set(write(value));
		},
		update(updater) {
			source.update((stored)=> write(updater(read(stored))));
		}
	};
}
