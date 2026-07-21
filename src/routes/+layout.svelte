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
		body {
			font-family: Avenir, Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif;
			font-weight: normal;
		}
	}
</style>
