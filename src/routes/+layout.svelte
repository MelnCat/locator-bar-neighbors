<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global {
        *, *::before, *::after {
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
