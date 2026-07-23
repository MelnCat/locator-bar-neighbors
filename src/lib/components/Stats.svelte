<script lang="ts">
	import { mostNeighborColors, neighborsToColors, neighborsToPlayers, totalPlayers } from "$lib/util/stats";
	import { Chart } from "svelte-echarts";

	import { init, use } from "echarts/core";
	import { BarChart, PieChart } from "echarts/charts";
	import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from "echarts/components";
	import { CanvasRenderer } from "echarts/renderers";

	use([GridComponent, CanvasRenderer, TitleComponent, TooltipComponent, PieChart, LegendComponent, BarChart]);
</script>

<div class="stat-panel">
	<h3>Players by Number of Neighbors (includes self)</h3>
	<div class="chart-list">
		<div class="chart">
			<Chart
				{init}
				options={{
					tooltip: {
						trigger: "item",
						formatter: p =>
							Array.isArray(p) ? "" : `<b>${p.name} Neighbors</b><br />${p.marker} ${p.value} Players (${p.percent}%)`,
					},
					series: [
						{
							name: "Players",
							type: "pie",
							radius: "60%",
							data: neighborsToPlayers.map(x => ({
								name: x.neighbors,
								value: x.players,
							})),
							label: {
								show: true,
								textBorderWidth: 0,
								textBorderColor: "transparent",
								textShadowColor: "transparent",
								color: "#eeeeee",
								formatter: "{b} ({d}%)",
							},
						},
					],
				}}
			/>
		</div>
		<div class="chart">
			<Chart
				{init}
				options={{
					tooltip: {
						trigger: "item",
						formatter: p =>
							Array.isArray(p)
								? ""
								: `<b>${p.name} Neighbors</b><br />${p.marker} ${p.value} Players (${+(((p.value as number) / totalPlayers) * 100).toFixed(2)}%)`,
					},
					xAxis: {
						type: "category",
						data: neighborsToPlayers.map(x => `${x.neighbors}`),
						name: "# of Neighbors",
					},
					yAxis: {
						type: "value",
						name: "Players",
					},
					series: [
						{
							type: "bar",
							data: neighborsToPlayers.map(x => x.players),
						},
					],
				}}
			/>
		</div>
	</div>
</div>
<div class="stat-panel">
	<h3>Colors with the most neighbors (18 neighbors)</h3>
	<ul>
		{#each mostNeighborColors as color}
			<li><span class="color" style:--color={`#${color}`}>#{color}</span></li>
		{/each}
	</ul>
</div>

<style>
	.color {
		background-color: var(--color);
		color: contrast-color(var(--color));
	}
	.stat-panel {
	}
	.chart-list {
		display: flex;
	}
	.chart {
		width: 40em;
		height: 30em;
	}
	@media screen and (max-width: 1300px) {
		.chart {
			font-size: 0.7em;
		}
	}
	@media screen and (max-width: 932px) {
		.chart {
			font-size: 0.6em;
		}
	}
	@media screen and (max-width: 766px) {
		.chart-list {
			flex-direction: column;
		}
		.chart {
			font-size: 0.9em;
		}
	}
	@media screen and (max-width: 688px) {
		.chart {
			font-size: 0.7em;
		}
	}
	@media screen and (max-width: 488px) {
		.chart {
			font-size: 0.5em;
		}
	}
</style>
