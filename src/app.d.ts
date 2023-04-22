/// <reference types="@sveltejs/kit" />

import type { Language, User } from "./lib/constants";

declare global {
	namespace App {
		interface Locals {
			user?: UserSys;
			language: Language;
			dictionary: Record<string, string>;
			preferences: Record<string, unknown>;
		}
	}
}
