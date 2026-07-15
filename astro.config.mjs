// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import Icons from "unplugin-icons/vite";
import { unified } from "@astrojs/markdown-remark";
import { remarkReadingTime } from "./remark/index.mjs";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

export default defineConfig({
	site: "https://fripe.dev",
	// site: "http://localhost:4321",
	base: "/",

	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [Icons({ compiler: "astro" })],
	},
	markdown: {
		processor: unified({
			remarkPlugins: [remarkReadingTime, remarkMath],
			rehypePlugins: [rehypeKatex, rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
		}),
		shikiConfig: {
			themes: {
				light: "one-dark-pro",
				dark: "one-dark-pro",
			},
		},
	},
});
