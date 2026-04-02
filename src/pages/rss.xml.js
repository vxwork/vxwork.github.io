import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { getSiteMeta, normalizeLang } from '../i18n';

export async function GET(context) {
	const posts = await getCollection('blog');
	const lang = normalizeLang(context.url.searchParams.get('lang'));
	const { title, description } = getSiteMeta(lang);
	return rss({
		title,
		description,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.id}/`,
		})),
	});
}
