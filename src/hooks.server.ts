import type { Handle, HandleServerError } from '@sveltejs/kit';
import { i } from '$sitb/server/intl';
import { serve } from '$sitb/server/root-loader';


export const handle: Handle = serve;

const codes: Record<string, string> = {
	11000: 'err.key.dup'
}
export const handleError: HandleServerError = ({error, event})=> {
	let code = (<any>error).code;
	if(!codes[code]) {
		console.error(error);
	}
	return {message: i(codes[code] || 'err.internal', event), code};
}

// TODO hook.ts error logging