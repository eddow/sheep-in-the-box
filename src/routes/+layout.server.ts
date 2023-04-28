import locals2data from "$sitb/server/root-loader";

export async function load({locals}: {locals: App.Locals}) {
	return await locals2data(locals);
}