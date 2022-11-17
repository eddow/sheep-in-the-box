import { privateStore } from "./privateStore";

export { T, language } from "./intl";
export { ajax } from "./ajax";
export { user } from "./auth";

const alertStore = privateStore<(alertSpec: AlertSpec | string)=> void>();
export const alert: SvelteStore<(alertSpec: AlertSpec | string)=> void> = alertStore.store;
export function setGlobalAlertCenter(alert: (alertSpec: AlertSpec | string)=> void) { alertStore.value = alert; }
