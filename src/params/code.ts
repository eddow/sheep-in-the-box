import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	return /^[a-f0-9]{32}$/i.test(param);
}