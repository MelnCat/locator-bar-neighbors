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

	const same = (await db
		.selectFrom("player")
		.where("renderedColor", "=", rendered.toLowerCase())
		.select(["username", "id"])
		.execute());

	return new Response(JSON.stringify(same), {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
};