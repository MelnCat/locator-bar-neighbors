<script lang="ts">
	import favicon from "$lib/assets/favicon.ico";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Locator Bar Neighbor Finder</title>
</svelte:head>

{@render children()}

<style>
	:global {
		*,
		*::before,
		*::after {
			box-sizing: border-box;
		}
		body {
			font-family: Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif;
			font-weight: normal;
			background-color: #141616;
			color: #ffffff;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		a {
			color: #597dad;
			text-decoration: none;
		}
		h1 {
			margin: 0 1em;
			font-size: 3em;
			margin-bottom: 0.5em;
			text-align: center;
		}
		h2 {
			margin: 0;
			margin-bottom: 1em;
		}
		button {
			font-family: inherit;
		}
		input {
			background-color: #1f2525;
			border: none;
			color: inherit;
			padding: 0.3em 0.6em;
		}
		.color-picker .wrapper {
			background-color: #1e2222;
			border: none;
			& input {
				background-color: #212929;
			}
			& button {
				background-color: #151a1a;
			}
		}
	}
</style>
