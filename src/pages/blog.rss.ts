import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer as getRendererMDX } from "@astrojs/mdx/container-renderer";
import { transform, walk } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";

// Based on:
// https://github.com/delucis/astro-blog-full-text-rss/blob/f920aee1c1909e9456c93d97db0c3bfc8288b5a2/src/pages/rss.xml.ts
export async function GET(context: APIContext) {
	const baseUrl = context.site?.href.replace(/\/$/, "") ?? "http://localhost:4321/";

	const renderers = await loadRenderers([getRendererMDX()]);
	const container = await AstroContainer.create({ renderers });

	const posts = await getCollection("blog");
	const items: RSSFeedItem[] = await Promise.all(
		posts
			.sort((a, b) => (a.data.pubDate > b.data.pubDate ? -1 : 1))
			.map(async (post) => {
				const { Content } = await render(post);
				const rawContent = await container.renderToString(Content);
				// Process the raw HTML output to make it suitable for RSS
				const content = await transform(rawContent.replace(/^<!DOCTYPE html>/, ""), [
					async (node) => {
						await walk(node, (node) => {
							if (node.name === "a" && node.attributes.href?.startsWith("/")) {
								node.attributes.href = baseUrl + node.attributes.href;
							}
							if (node.name === "img" && node.attributes.src?.startsWith("/")) {
								node.attributes.src = baseUrl + node.attributes.src;
							}
						});
						return node;
					},
					sanitize({ dropElements: ["script", "style"] }),
				]);
				return {
					...post.data,
					link: `/blog/${post.id}/`,
					content,
				};
			}),
	);

	return rss({
		items: items,
		title: "Fripe's Blog",
		description: "Stories and projects from Fripe",
		site: baseUrl,
		customData: Object.entries({
			language: "en",
			lastBuildDate: new Date().toUTCString(),
			generator: "Astro",
		})
			.map(([key, value]) => `<${key}>${value}</${key}>`)
			.join("\n"),
	});
}
