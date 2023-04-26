// TODO? Kill me?
export type Listener = (...args: any[])=> Promise<boolean> | boolean | undefined;
export type Subscription = (listener: Listener)=> (()=> boolean);
export function listenable() {
	const listeners = new Set<Listener>();
	return {
		subscribe(listener: Listener) {
			listeners.add(listener);
			return function() {
				return listeners.delete(listener);
			}
		},
		async raise(...args: any[]) {
			let entry: IteratorResult<[Listener, Listener], any>, entries = listeners.entries();
			while(entry = entries.next(), !entry.done) {
				let result = entry.value[0](...args);
				if(result instanceof Promise) result = await result;
				if(result === false)
					return false;
			}
			return true;
		}
	};
}