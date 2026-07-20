import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ url }) => {
	
	return new Response(String(""));
};
