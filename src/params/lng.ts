import type { ParamMatcher } from '@sveltejs/kit';
import { languages } from "$lib/constants";
 
export const match: ParamMatcher = (param) => {
  return param in languages;
}