export type Lang = 'en-US' | 'zh-CN';

export const SUPPORTED_LANGS: Lang[] = ['en-US', 'zh-CN'];

export function normalizeLang(input: string | null | undefined): Lang {
	const v = (input ?? '').trim().toLowerCase();
	if (v === 'zh' || v === 'zh-cn' || v === 'zh_cn') return 'zh-CN';
	return 'en-US';
}

type Dict = {
	siteTitle: string;
	siteDescription: string;
	lastUpdatedOn: string;
	navHome: string;
	navBlog: string;
	navAbout: string;
	goToGithubRepo: string;
	languageNameEn: string;
	languageNameZh: string;
};

const DICT: Record<Lang, Dict> = {
	'en-US': {
		siteTitle: 'QVeris Blog',
		siteDescription: 'Welcome to QVeris.',
		lastUpdatedOn: 'Last updated on',
		navHome: 'Home',
		navBlog: 'Blog',
		navAbout: 'About',
		goToGithubRepo: "Go to QVeris AI's GitHub repo",
		languageNameEn: 'English',
		languageNameZh: '中文',
	},
	'zh-CN': {
		siteTitle: 'QVeris 博客',
		siteDescription: '欢迎来到 QVeris。',
		lastUpdatedOn: '最后更新于',
		navHome: '首页',
		navBlog: '博客',
		navAbout: '关于',
		goToGithubRepo: "前往 QVeris AI 的 GitHub 仓库",
		languageNameEn: 'English',
		languageNameZh: '中文',
	},
};

export function t(lang: Lang, key: keyof Dict): string {
	const normalized = normalizeLang(lang);
	return DICT[normalized][key];
}

export function getSiteMeta(lang: Lang): { title: string; description: string } {
	const normalized = normalizeLang(lang);
	return {
		title: DICT[normalized].siteTitle,
		description: DICT[normalized].siteDescription,
	};
}

export function getLanguageLabel(lang: Lang): string {
	const normalized = normalizeLang(lang);
	return normalized === 'zh-CN' ? DICT[normalized].languageNameZh : DICT[normalized].languageNameEn;
}

