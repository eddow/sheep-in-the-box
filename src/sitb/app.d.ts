/// <reference types="@sveltejs/kit" />

import type { Language } from "$sitb/constants";
import type User from "$sitb/entities/user";

declare global {
	namespace App {
		interface Locals {
			user?: User;
			language: Language;
			dictionary: Record<string, string>;
			preferences: Record<string, unknown>;
			roles: Roles;
		}
	}
}
