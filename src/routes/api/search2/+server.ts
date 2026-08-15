import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import type { RequestHandler } from "./$types";
import { getRenderedColor } from "$lib/util/colors";

export const GET: RequestHandler = async ({ url }) => {
	const color = url.searchParams.get("color");

	if (!color || typeof color !== "string") {
		error(400, "Invalid color");
	}

	const rendered = getRenderedColor(color);

	const players = await db.selectFrom("player").where("color", "=", color.toLowerCase()).selectAll().execute();
	const sameRendered = (await db
		.selectFrom("player")
		.where("renderedColor", "=", rendered.toLowerCase())
		.select(({ fn }) => fn.count("id").as("count"))
		.execute())[0].count;

	return new Response(JSON.stringify({ players, sameRendered }), {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
};
