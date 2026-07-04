import { execSync } from "node:child_process";
import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

export function remarkReadingTime() {
	return function (tree, { data }) {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.minutesRead = readingTime.text;
	};
}

export function remarkModifiedTime() {
	return function (tree, file) {
		const filepath = file.history[0];
		const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`);
		if (result.toString().trim()) {
			file.data.astro.frontmatter.lastModified = new Date(result.toString().trim()).toISOString();
		} else {
			file.data.astro.frontmatter.lastModified = undefined;
		}

		const commitCountResult = execSync(`git rev-list --count HEAD -- "${filepath}"`);
		file.data.astro.frontmatter.modificationCount = Number(commitCountResult.toString().trim());
	};
}
