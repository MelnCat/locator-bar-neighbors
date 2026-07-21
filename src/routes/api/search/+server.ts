import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import type { RequestHandler } from "./$types";


export const GET: RequestHandler = async ({ url }) => {
	const color = url.searchParams.get("color");

	if (!color || typeof color !== "string") {
		error(400, "Invalid color");
	}

	const players = await db
		.selectFrom("player")
		.where("color", "=", color)
		.selectAll()
		.execute();

	return new Response(JSON.stringify(players));
};
