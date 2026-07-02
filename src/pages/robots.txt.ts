const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${new URL("/sitemap-index.xml", import.meta.env.SITE).toString()}
`;

export function GET() {
	return new Response(robotsTxt);
}
