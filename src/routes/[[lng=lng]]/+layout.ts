import loadSideR from "$sitb/root-loader";

export async function load({data}: {data: any}) {
	return loadSideR(data);
}