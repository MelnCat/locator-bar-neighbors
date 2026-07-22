import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
	const color = url.searchParams.get("color");

	if (!color || typeof color !== "string") {
		error(400, "Invalid color");
	}

	const players = await db.selectFrom("player").where("color", "=", color).selectAll().execute();

	return new Response(JSON.stringify(players), {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
};
