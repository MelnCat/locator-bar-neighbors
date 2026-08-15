import { Kysely, sql, SqliteDialect } from "kysely";
import type { Database } from "./types";
import SQLite from "better-sqlite3";

export const sqlite = new SQLite("local.db");

export const db = new Kysely<Database>({
	dialect: new SqliteDialect({
		database: sqlite,
	}),
});

await db.schema
	.createTable("player")
	.ifNotExists()
	.addColumn("id", "text", col => col.primaryKey())
	.addColumn("color", "text", col => col.notNull())
	.addColumn("username", "text", col => col.notNull().unique())
	.addColumn("renderedColor", "text")
	.execute();

await db.schema.createIndex("player_color_index").ifNotExists().on("player").column("color").execute();
await db.schema.createIndex("player_rendered_color_index").ifNotExists().on("player").column("renderedColor").execute();
