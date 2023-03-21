import RoTable from "./Table.svelte";
import ReTable from "./edition/row/Table.svelte";
import CeColumn from "./edition/cell/Column.svelte";
import RoColumn from "./Column.svelte";

export const displayTable = <T>()=> ({
	Table: RoTable<T>,
	Column: RoColumn<T>
}),  cellEditTable = <T>()=> ({
	Table: RoTable<T>,
	Column: CeColumn<T>,
	RoColumn: RoColumn<T>
}),  rowEditTable = <T>()=> ({
	Table: ReTable,//<T>,
	Column: RoColumn<T>
});