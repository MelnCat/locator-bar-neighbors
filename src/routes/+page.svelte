<script lang="ts">
	import ColorPicker from "svelte-awesome-color-picker";
	import bar from "$lib/assets/img/bar.png";
	import playerIcon from "$lib/assets/img/player_icon.png";

	let innerWidth = $state(0);
	let colorInput = $state("#ffffff");
	let usernameInput = $state("");
	let chosenColor: string | null = $state(null);
	let inputType: "color" | "username" = $state("color");
	let data: { id: string; color: string; username: string }[] | null = $state([]);
	let loading = $state(false);
	let error: string | null = $state(null);
	let mouseX = $state(0);
	const displayColor = $derived(loading ? "555555" : error ? "ff2222" : (chosenColor ?? "222222"));

	const search = async () => {
		error = null;
		loading = true;
		try {
			if (inputType === "color") {
				data = await (await fetch(`/api/search?color=${encodeURIComponent(colorInput.replace("#", ""))}`)).json();
				chosenColor = colorInput.replace("#", "");
			} else if (inputType === "username") {
				if (!usernameInput) {
					error = "No username specified.";
					loading = false;
					return;
				}
				const json = await (await fetch(`https://api.ashcon.app/mojang/v2/user/${encodeURIComponent(usernameInput)}`)).json();
				if (!json.uuid) {
					error = `User "${usernameInput}" not found.`;
					loading = false;
					return;
				}
				const uuid = json.uuid.replaceAll("-", "");
				const hash =
					parseInt(uuid.slice(0, 8), 16) ^
					parseInt(uuid.slice(8, 16), 16) ^
					parseInt(uuid.slice(16, 24), 16) ^
					parseInt(uuid.slice(24, 32), 16);

				const hex = (hash & 0xffffff).toString(16).padStart(6, "0");
				data = await (await fetch(`/api/search?color=${encodeURIComponent(hex)}`)).json();
				chosenColor = hex;
			}
		} catch (err) {
			error = String(err);
			data = [];
		}
		loading = false;
	};
</script>

<svelte:window
	onmousemove={e => {
		mouseX = e.clientX;
	}}
	bind:innerWidth
/>

<h1>Locator Color Neighbor Finder</h1>
<form
	onsubmit={e => {
		e.preventDefault();
		search();
	}}
>
	<div class="panes">
		<section class="left" data-selected={inputType === "color" || null}>
			<h2>Enter Color</h2>
			<ColorPicker
				bind:hex={colorInput}
				onInput={() => {
					inputType = "color";
				}}
				isAlpha={false}
				label="Color"
			/>
		</section>
		<div class="or">OR</div>
		<section class="right" data-selected={inputType === "username" || null}>
			<h2>Enter Username</h2>
			<input
				bind:value={usernameInput}
				oninput={() => {
					inputType = "username";
				}}
				onfocus={() => {
					inputType = "username";
				}}
			/>
		</section>
	</div>

	<button class="search" type="submit">Search</button>
</form>

<div class="result" style:--color={`#${displayColor}`}>
	<div class="player-list">
		<div class="player-list-color">{chosenColor && !loading && !error ? `#${chosenColor.toUpperCase()}` : ""}</div>
		{#if loading}
			<p class="message">Searching...</p>
		{:else if error}
			<p class="message error">{error}</p>
		{:else if data}
			{#each data.slice(0).sort((a, b) => a.username.localeCompare(b.username)) as player}
				<div class="player">
					<div class="uuid">
						{`${player.id.slice(0, 8)}-${player.id.slice(8, 12)}-${player.id.slice(12, 16)}-${player.id.slice(16, 20)}-${player.id.slice(20, 32)}`}
					</div>
					<div class="name">{player.username}</div>
					<div class="skin"><img src={`https://nmsr.nickac.dev/fullbody/${player.id}`} alt={`${player.username} skin`} /></div>
				</div>
			{/each}
		{:else}
			<p class="message"></p>
		{/if}
		<div class="bar-preview">
			<div class="locator-bar">
				<img class="bar" src={bar} alt="Locator bar" />
				<svg width="0" height="0" style="position:absolute">
					<filter id="tint">
						<feFlood flood-color={`#${displayColor}`} result="flood" />
						<feComposite in="flood" in2="SourceGraphic" operator="in" result="tinted" />
						<feBlend in="tinted" in2="SourceGraphic" mode="multiply" />
					</filter>
				</svg>

				<div class="player-icon" style:--x={mouseX / innerWidth} style:--img={`url("${playerIcon}")`}>
					<img src={playerIcon} alt="Player icon" />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
.search {
    text-align: center;
    background-color: #ffffff33;
    border: none;
    color: inherit;
    padding: 0.2em 0.6em;
    cursor: pointer;
    &:hover {
    background-color: #ffffff66;
    }
}
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
	.skin {
		width: 6em;
		img {
			width: 100%;
			aspect-ratio: 205.6 / 348.95;
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
	.player {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #222424;
		padding: 0.5em 1em;
		gap: 0.5em;
	}
	.uuid {
		color: #4c595c;
		font-size: 0.8em;
		text-align: center;
	}
	.name {
		font-weight: bold;
	}
	.player-list {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5em;
		padding: 0.5em;
		width: min(80vw, 80em);
	}
	.player-list-color,
	.message,
	.bar-preview {
		min-height: 1.5em;
		grid-row: 0;
		grid-column-end: span 4;
		width: 100%;
		text-align: center;
		padding: 0.5em 1em;
		font-weight: bold;
		font-size: 1.2em;
		display: flex;
		align-items: center;
		justify-content: center;
        transition: background-color 0.25s;
	}
	.player-list-color {
		background-color: var(--color);
		color: contrast-color(var(--color));
	}
	.result {
		--color: #ffffff11;
		display: flex;
		flex-direction: column;
		border: 0.2em color-mix(var(--color), 60% transparent) solid;
		margin: 1em;
        transition: border-color 0.25s;
	}
	.error {
		color: red;
	}
	.panes {
		display: flex;
		gap: 1em;
		align-items: stretch;
		padding: 1em;
	}
	.or {
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
	}
	section {
		opacity: 0.6;
		&[data-selected] {
			opacity: 1;
		}
	}
</style>
