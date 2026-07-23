import stats from "./stats.json" with { type: "json" };

export const neighborsToColors = Object.entries(stats.neighborsToColors).map(x => ({ neighbors: +x[0], colors: x[1] }));
export const neighborsToPlayers = Object.entries(stats.neighborsToPlayers)
	.map(x => ({ neighbors: +x[0], players: x[1] }))
	.filter(x => x.neighbors !== 0);
export const totalPlayers = Object.values(stats.neighborsToPlayers).reduce((l, c) => l + c, 0);
export const mostNeighborColors = [`5cc377`, `6e28e4`, `aa7316`, `e08faf`];
