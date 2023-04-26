import { dev } from "$app/environment";
import type { Cookies } from "@sveltejs/kit";

const clientCookieMgt = {
    getCookie(name: string) {
        let cookieName = name + '=';
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
    },
	setCookie(name: string, value: string, expDays: number = 30) {
        const d = new Date();
        d.setTime(d.getTime() + (expDays*24*60*60*1000));
		document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/' + (dev?'':'; secure');
    },
	deleteCookie(name: string) {
        document.cookie = name+'=; Max-Age=-99999999;'; 
    }
};
export function setSSR(cookies: Cookies) {
	getCookie = cookies.get;
	deleteCookie = cookies.delete;
	setCookie = (name: string, value: string, expDays: number = 30)=> {
		cookies.set(name, value, {
			path: '/',
			sameSite: 'strict',
			secure: !dev,
			maxAge: expDays*24*60*60*1000
		});
	}
}
let {getCookie, setCookie, deleteCookie} = clientCookieMgt;
export {getCookie, setCookie, deleteCookie};
const stringCookies = new Proxy({}, {
	get(target: any, prop: PropertyKey, receiver: any): any {
		return getCookie(prop.toString());
	},
	set(target: any, prop: PropertyKey, value: any, receiver: any): boolean {
		setCookie(prop.toString(), value);
		return true;
	},
	deleteProperty(target: any, prop: PropertyKey): boolean {
		deleteCookie(prop.toString());
		return true;
	}
});
const jsonCookies = new Proxy({}, {
	get(target: any, prop: PropertyKey, receiver: any): any {
		const rv = getCookie(prop.toString());
		return rv ? JSON.parse(rv) : null;
	},
	set(target: any, prop: PropertyKey, value: any, receiver: any): boolean {
		setCookie(prop.toString(), JSON.stringify(value));
		return true;
	},
	deleteProperty(target: any, prop: PropertyKey): boolean {
		deleteCookie(prop.toString());
		return true;
	}
});
export {stringCookies, jsonCookies};