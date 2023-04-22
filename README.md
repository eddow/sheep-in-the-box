# Sheep in the box

Nothing to see here, I use this repo for sharing w/ pals and "saving" my work.

## install

[https://fomantic-ui.com/introduction/getting-started.html]
```sh
$ cd node_modules/fomantic-ui
$ npx gulp install
```

```sh
$ cd semantic/
$ npx gulp build
```

# svemantic

-> remove link in src/svemantic
-> change .kit.alias in svelte.config.js
-> uninstall jquery

mklink -J src\svemantic ..\svemantic\src\lib

# TODO

- Data returned from `load` while rendering /[[lng=lng]]/(@cms)/edit/[article] is not serializable: Cannot stringify arbitrary non-POJOs (data.list[0].texts[0])
- summernote js CSR loading
- DB garbage collection (sessions, pw recovery, ...)
- row-model -> property (not store in context) ?
- on:beforeUnload generic management - listenable ?