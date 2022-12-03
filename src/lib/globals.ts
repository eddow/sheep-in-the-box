export { T, language } from "./intl";
export { ajax } from "./ajax";
export { user } from "./user";

export let alert: (alertSpec: AlertSpec | string)=> void;
export function setGlobalAlertCenter(alertCenter: (alertSpec: AlertSpec | string)=> void) { alert = alertCenter; }

export const YesNo = [{text: 'cmd.no', color: 'secondary', icon: 'x', value: false}, {text: 'cmd.yes', color: 'primary', icon: 'check', value: true}];
export const YesNoCancel = [
	{text: 'cmd.cancel', color: 'warning', icon: 'x-lg', value: null},
	{text: 'cmd.no', color: 'secondary', icon: 'x', value: false},
	{text: 'cmd.yes', color: 'primary', icon: 'check', value: true}
];
export const OkCancel = [{text: 'cmd.cancel', color: 'secondary', icon: 'x', value: false}, {text: 'cmd.ok', color: 'success', icon: 'check', value: true}];
export const DeleteCancel = [{text: 'cmd.cancel', color: 'secondary', icon: 'x', value: false}, {text: 'cmd.delete', color: 'danger', icon: 'trash', value: true}];
export let confirm: Confirmation;
export function setGlobalConfirmCenter(confirmCenter: Confirmation) { confirm = confirmCenter; }