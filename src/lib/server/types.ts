import type { ColumnType, Generated, Insertable, JSONColumnType, Selectable, Updateable } from "kysely";

export interface Database {
	player: PlayerTable;
}

export interface PlayerTable {
	id: string;
	color: string;
	username: string;
}

export type Player = Selectable<PlayerTable>;
export type NewPlayer = Insertable<PlayerTable>;
export type PlayerUpdate = Updateable<PlayerTable>;
