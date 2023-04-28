# Sheep in the box

Nothing to see here, I use this repo for sharing w/ pals and "saving" my work.

## install

Create a new sveltekit project
link in the files:
```
./src/routes/[[lng=lng]/(sitb) -> /sheep-in-the-box/src/routes/[[lng=lng]]
./src/sitb -> /sheep-in-the-box/src/sitb

```

Copy the `src/params` folder

### `./src/routes/+layout`
- `.ts` should return data from `import loadSideR from "$sitb/root-loader";`
- `.server.ts` should return data from `import locals2data from "$sitb/server/root-loader";`
- `.svelte` can include the language/user menu button from `import Menu from '$sitb/components/root/Menu.svelte';`

### `./src
# TODO

- Data returned from `load` while rendering /[[lng=lng]]/(@cms)/edit/[article] is not serializable: Cannot stringify arbitrary non-POJOs (data.list[0].texts[0])
- summernote js CSR loading
- DB garbage collection (sessions, pw recovery, ...)
- row-model -> property (not store in context) ?
- on:beforeUnload generic management - listenable ?