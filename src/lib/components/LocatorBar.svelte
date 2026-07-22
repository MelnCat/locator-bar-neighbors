<script lang="ts">
	import bar from "$lib/assets/img/bar.png";
	import playerIcon0 from "$lib/assets/img/icon/default_0.png";
	import playerIcon1 from "$lib/assets/img/icon/default_1.png";
	import playerIcon2 from "$lib/assets/img/icon/default_2.png";
	import playerIcon3 from "$lib/assets/img/icon/default_3.png";

	let { color }: { color: string } = $props();

	let innerWidth = $state(0);
	let mouseX = $state(0);
	let iconX = $derived(Math.min(1, Math.max(0, mouseX / innerWidth)));

	const playerIcon = $derived.by(() => {
        if (!innerWidth || !mouseX) return playerIcon0;
		const magnitude = Math.abs(2 * (iconX - 0.5));
		if (magnitude < 0.7) return playerIcon0;
		if (magnitude < 0.85) return playerIcon1;
		if (magnitude < 0.95) return playerIcon2;
		return playerIcon3;
	});
</script>

<svelte:window
	onmousemove={e => {
		mouseX = e.clientX;
	}}
	bind:innerWidth
/>
<div class="bar-preview">
	<div class="locator-bar">
		<img class="bar" src={bar} alt="Locator bar" />
		<svg width="0" height="0" style="position:absolute">
			<filter id="tint">
				<feFlood flood-color={`#${color}`} result="flood" />
				<feComposite in="flood" in2="SourceGraphic" operator="in" result="tinted" />
				<feBlend in="tinted" in2="SourceGraphic" mode="multiply" />
			</filter>
		</svg>

		<div class="player-icon" style:--x={innerWidth && mouseX ? iconX : 0.5}>
			<img src={playerIcon} alt="Player icon" />
		</div>
	</div>
</div>

<style>
	.bar-preview {
		image-rendering: pixelated;
	}
	.locator-bar {
		font-size: 2em;
		position: relative;
	}
	.player-icon {
		width: 0.7em;
		height: 0.7em;
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
		transform: translateX(calc(8em * (var(--x) - 0.5)));
		img {
			width: 100%;
			height: 100%;
			display: block;
			filter: url(#tint);
		}
	}
	.bar {
		position: absolute;
		height: 0.5em;
		width: 8.8em;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
	}

	@media screen and (max-width: 500px) {
		.locator-bar {
			font-size: 1.5em;
		}
	}
</style>
