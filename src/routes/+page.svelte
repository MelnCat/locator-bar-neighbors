<script lang="ts">
	import ColorPicker from "svelte-awesome-color-picker";
	import LocatorBar from "$lib/components/LocatorBar.svelte";
	import playerIconBow from "$lib/assets/img/icon/bowtie.png";
	import confetti from "canvas-confetti";
	import Stats from "$lib/components/Stats.svelte";
	import { neighborsToPlayers, totalPlayers } from "$lib/util/stats";

	let colorInput = $state("#ffffff");
	let usernameInput = $state("");
	let chosenColor: string | null = $state(null);
	let inputType: "color" | "username" = $state("username");
	let data: { id: string; color: string; username: string; notInDb?: boolean }[] | null = $state([]);
	let loading = $state(false);
	let error: string | null = $state(null);
	let emptyMessage = $state("");
	let colorOpen = $state(false);
	const displayColor = $derived(loading ? "555555" : error ? "ff2222" : (chosenColor ?? "222222"));
	$effect(() => {
		if (colorOpen) {
			inputType = "color";
		}
	});

	const search = async () => {
		error = null;
		loading = true;
		emptyMessage = "";
		try {
			if (inputType === "color") {
				data = await (await fetch(`/api/search?color=${encodeURIComponent(colorInput.replace("#", "").toLowerCase())}`)).json();
				chosenColor = colorInput.replace("#", "");
				if (data!.length === 0) {
					emptyMessage = "You found one of the 330581 colors without any players!";
				}
			} else if (inputType === "username") {
				if (!usernameInput) {
					error = "No username specified.";
					loading = false;
					return;
				}
				const uuid = await (async () => {
					if (usernameInput.match(/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i)) {
						return usernameInput.replaceAll("-", "").toLowerCase();
					}
					const json = await (
						await fetch(`https://playerdb.co/api/player/minecraft/${encodeURIComponent(usernameInput)}`)
					).json();
					if (!json.data?.player?.raw_id) {
						error = `User "${usernameInput}" not found.`;
						loading = false;
						return;
					}
					return json.data.player.raw_id as string;
				})();
				if (!uuid) return;
				const hash =
					parseInt(uuid.slice(0, 8), 16) ^
					parseInt(uuid.slice(8, 16), 16) ^
					parseInt(uuid.slice(16, 24), 16) ^
					parseInt(uuid.slice(24, 32), 16);

				const hex = (hash & 0xffffff).toString(16).padStart(6, "0");
				data = await (await fetch(`/api/search?color=${encodeURIComponent(hex).toLowerCase()}`)).json();
				chosenColor = hex;
				if (data!.length === 0) {
					emptyMessage = "This player is not in the dataset, and has no known players with their color! Very impressive.";
				} else if (!data!.some(x => x.id === uuid)) {
					data!.push({ id: uuid, color: hex, username: usernameInput, notInDb: true });
				}
			}
			if (data!.length === 0) {
				confetti();
			}
			data = await Promise.all(
				data!.map(async x => {
					const json = await (await fetch(`https://playerdb.co/api/player/minecraft/${encodeURIComponent(x.id)}`)).json();
					console.log(json);
					if (!json.data?.player?.username) {
						return x;
					}
					return { ...x, username: json.data.player.username };
				}),
			);
		} catch (err) {
			error = String(err);
			data = [];
		}
		loading = false;
	};
</script>

<h1>Locator Bar Neighbor Finder</h1>
<p class="desc">
	Find other players with the same locator bar color as you! Uses a <a href="https://archive.org/details/minecraft-uuids-2025-09-01"
		>dataset of 66m players</a
	> by matdoesdev.
</p>
<form
	onsubmit={e => {
		e.preventDefault();
		search();
	}}
>
	<div class="panes">
		<section class="left" data-selected={inputType === "username" || null}>
			<h2>Enter Username or UUID</h2>
			<input
				bind:value={usernameInput}
				placeholder="Username or UUID"
				oninput={() => {
					inputType = "username";
				}}
				onfocus={() => {
					inputType = "username";
				}}
			/>
		</section>
		<div class="or">OR</div>
		<section class="right" data-selected={inputType === "color" || null}>
			<h2>Enter Color</h2>
			<ColorPicker
				bind:hex={colorInput}
				onInput={e => {
					if (e.hex !== "#ffffff") inputType = "color";
				}}
				bind:isOpen={colorOpen}
				isAlpha={false}
				label="Color"
			/>
		</section>
	</div>

	<button class="search" type="submit" disabled={loading}>Search</button>
</form>

<div class="result" style:--color={`#${displayColor}`}>
	<div class="player-list">
		<div class="player-list-color">{chosenColor && !loading && !error ? `#${chosenColor.toUpperCase()}` : ""}</div>
		{#if loading}
			<p class="message">Searching...</p>
		{:else if error}
			<p class="message error">{error}</p>
		{:else if data}
			{#if data.length}
				{#each data.slice(0).sort((a, b) => a.username.localeCompare(b.username)) as player}
					<div class="player" data-notindb={player.notInDb}>
						<div class="uuid">
							{`${player.id.slice(0, 8)}-${player.id.slice(8, 12)}-${player.id.slice(12, 16)}-${player.id.slice(16, 20)}-${player.id.slice(20, 32)}`}
						</div>
						<div class="name">{player.username}</div>
						<div class="skin">
							<img src={`https://nmsr.nickac.dev/fullbody/${player.id}`} alt={`${player.username} skin`} />
						</div>
						{#if player.notInDb}
							<div class="notindb">Player not in database</div>
						{/if}
					</div>
				{/each}
			{:else}
				<div class="message special">
					{emptyMessage}
				</div>
			{/if}
		{:else}
			<p class="message"></p>
		{/if}
		{#if data?.length}
			<p class="message thin">
				{data.length} players have this color. ({(
					((neighborsToPlayers.find(x => x.neighbors === data!.length)!.players ?? 0) / totalPlayers) *
					100
				).toFixed(2)}% chance of {data.length} neighbors)
			</p>
		{/if}
		<div class="bar-preview">
			<LocatorBar color={displayColor} />
		</div>
	</div>
</div>

<p>Fun fact: There are 330581 colors with no players in the dataset.</p>

<div class="stats">
	<h2>Statistics</h2>
	<Stats />
</div>

<footer>
	<div>Made by melncat.</div>
	<div><a href="https://github.com/MelnCat/locator-bar-neighbors">Source Code</a></div>
</footer>

<style>
	.thin {
		margin: 0;
	}
	.stats {
		margin-top: 2em;
	}
	.notindb {
		color: #ffffffdd;
	}
	.desc {
		text-align: center;
		margin: 0 2em;
	}
	.search {
		display: flex;
		text-align: center;
		background-color: #ffffff33;
		border: none;
		color: inherit;
		font-size: 1.2em;
		padding: 0.4em 1em;
		cursor: pointer;
		margin: 0 auto;
		transition: background-color 0.25s;
		&:hover {
			background-color: #ffffff66;
		}
		&:disabled {
			cursor: not-allowed;
			background-color: #ffffff11;
			color: #555555;
		}
	}
	.skin {
		width: 6em;
		img {
			width: 100%;
			aspect-ratio: 205.6 / 348.95;
		}
	}
	.player {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #222424;
		padding: 0.5em 1em;
		gap: 0.5em;
		&[data-notindb] {
			background-color: #2d1d1c;
			.name {
				color: #e39898;
			}
			.uuid {
				color: #972e2e;
			}
		}
	}
	.uuid {
		color: #4c595c;
		font-size: 0.8em;
		text-align: center;
		word-wrap: anywhere;
	}
	.name {
		font-weight: bold;
	}
	.player-list {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.5em;
		padding: 0.5em;
		width: min(80vw, 80em);
	}
	.player-list-color,
	.message,
	.bar-preview {
		min-height: 1.5em;
		grid-column: 1 / -1;
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
		width: 20em;
		background-color: #ffffff11;
		padding: 1em 1.5em;
		opacity: 0.6;
		input {
			background-color: #ffffff11;
			padding: 0.6em 1em;
			font-size: 1em;
			width: 100%;
		}
		&[data-selected] {
			opacity: 1;
		}
	}

	@media screen and (max-width: 830px) {
		.player-list {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media screen and (max-width: 630px) {
		.player-list {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.panes {
			flex-direction: column;
		}
		section {
			width: 22em;
		}
		h1 {
			font-size: 2.7em;
		}
	}
</style>
