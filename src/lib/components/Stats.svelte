<script lang="ts">
	import { neighborsToColors, neighborsToPlayers } from "$lib/util/stats";
	import { Chart } from "svelte-echarts";

	import { init, use } from "echarts/core";
	import { BarChart, PieChart } from "echarts/charts";
	import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from "echarts/components";
	import { CanvasRenderer } from "echarts/renderers";

	use([GridComponent, CanvasRenderer, TitleComponent, TooltipComponent, PieChart, LegendComponent]);
</script>

<div class="stat-panel">
	<h3>Players by Number of Neighbors</h3>
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
							Array.isArray(p) ? "" : `<b>${p.name} Neighbors</b><br />${p.marker} ${p.value} Players (${p.percent}%)`,
					},
					xAxis: {
						type: "category",
						data: neighborsToPlayers.map(x => `${x.neighbors}`),
					},
					yAxis: {
						type: "value",
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
	<h3>Colors by Number of Players</h3>
	<div class="chart">
		<Chart
			{init}
			options={{
				tooltip: {
					trigger: "item",
				},
				series: [
					{
						name: "Players",
						type: "pie",
						radius: "60%",
						data: neighborsToColors.map(x => ({
							name: x.neighbors,
							value: x.colors,
						})),
						label: {
							show: true,
							textBorderWidth: 0,
							textBorderColor: "transparent",
							textShadowColor: "transparent",
							color: "#eeeeee",
						},
					},
				],
			}}
		/>
	</div>
</div>

<style>
.stat-panel {

}
.chart-list {
    display: flex;
}
	.chart {
		width: 40em;
		height: 30em;
	}
</style>
