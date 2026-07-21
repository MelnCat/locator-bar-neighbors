<script lang="ts">
	import ColorPicker from "svelte-awesome-color-picker";
	let colorInput = $state("");
	let usernameInput = $state("");
	let displayColor = $state("");
	let inputType: "color" | "username" = $state("color");
	let data: { id: string; color: string; username: string }[] | null = $state([]);
	let loading = $state(false);
	let error: string | null = $state(null);

	const search = async () => {
		error = null;
		loading = true;
		try {
			if (inputType === "color") {
				data = await (await fetch(`/api/search?color=${encodeURIComponent(colorInput.replace("#", ""))}`)).json();
                displayColor = colorInput.replace("#", "");
			} else if (inputType === "username") {
				const json = await (await fetch(`https://api.ashcon.app/mojang/v2/user/${encodeURIComponent(usernameInput)}`)).json();
				const uuid = json.uuid.replaceAll("-", "");
				const hash =
					parseInt(uuid.slice(0, 8), 16) ^
					parseInt(uuid.slice(8, 16), 16) ^
					parseInt(uuid.slice(16, 24), 16) ^
					parseInt(uuid.slice(24, 32), 16);

				const hex = (hash & 0xffffff).toString(16).padStart(6, "0");
                displayColor = hex;
				data = await (await fetch(`/api/search?color=${encodeURIComponent(hex)}`)).json();
			}
		} catch (err) {
			error = String(err);
			data = [];
		}
		loading = false;
	};
</script>

<h1>Locator Color Neighbor Finder</h1>

<div class="panes">
	<section class="left" data-selected={inputType === "color" || null}>
		<h2>Enter Color</h2>
		<ColorPicker
			bind:hex={colorInput}
			onInput={() => {
				data = null;
				inputType = "color";
			}}
		/>
	</section>
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

<button onclick={search}>Search</button>

{#if loading}
	<p>Searching...</p>
{:else if error}
	<p style="color: red;">{error}</p>
{:else if !data}
	<p style="color: red;">{error}</p>
{:else if data.length === 0 && colorInput}
	<p>No players found for color "{colorInput}"</p>
{:else if data.length > 0}
	<ul>
		{#each data as player}
			<li>{player.username}: <span style="color: #{player.color};">{player.color}</span></li>
		{/each}
	</ul>
{/if}

<style>
	.panes {
		display: flex;
		gap: 1em;
	}
	section {
		opacity: 0.6;
		&[data-selected] {
			opacity: 1;
		}
	}
</style>
