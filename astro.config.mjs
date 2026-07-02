// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import Icons from "unplugin-icons/vite";

export default defineConfig({
	// site: "https://fripe.dev",
	site: "http://localhost:4321",
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [Icons({ compiler: "astro" })],
	},
});
