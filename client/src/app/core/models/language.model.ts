export interface Language {
    code: string;
    name: string;
    is_default: boolean;
    direction: 'ltr' | 'rtl';
}

export interface TranslationMap {
    [key: string]: string;
}

export interface PageContent {
    title: string;
    slug_localized: string;
    seo_title: string;
    seo_desc: string;
    content_json: any;
}
