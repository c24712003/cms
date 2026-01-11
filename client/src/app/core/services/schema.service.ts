import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import {
    JsonLdContext,
    OrganizationSchema,
    WebSiteSchema,
    WebPageSchema,
    BreadcrumbListSchema,
    BreadcrumbItem,
    ArticleSchema,
    FAQPageSchema,
    FAQItem
} from '../models/schema.types';

/**
 * Schema Service
 * Generates and injects JSON-LD structured data for SEO
 */
@Injectable({
    providedIn: 'root'
})
export class SchemaService {
    private readonly SCHEMA_SCRIPT_ID = 'json-ld-schema';

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    /**
     * Inject JSON-LD script into the document head
     */
    private injectSchema(schema: JsonLdContext | JsonLdContext[]): void {
        // Remove existing schema script
        this.removeSchema();

        const script = this.document.createElement('script');
        script.id = this.SCHEMA_SCRIPT_ID;
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        this.document.head.appendChild(script);
    }

    /**
     * Remove existing schema script
     */
    removeSchema(): void {
        const existing = this.document.getElementById(this.SCHEMA_SCRIPT_ID);
        if (existing) {
            existing.remove();
        }
    }

    /**
     * Generate and inject Organization schema
     */
    setOrganizationSchema(config: {
        name: string;
        url: string;
        logo?: string;
        sameAs?: string[];
    }): void {
        const schema: OrganizationSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: config.name,
            url: config.url,
            ...(config.logo && { logo: config.logo }),
            ...(config.sameAs && { sameAs: config.sameAs })
        };
        this.injectSchema(schema);
    }

    /**
     * Generate and inject WebSite schema (with optional search action)
     */
    setWebSiteSchema(config: {
        name: string;
        url: string;
        searchUrl?: string;
    }): void {
        const schema: WebSiteSchema = {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: config.name,
            url: config.url,
            ...(config.searchUrl && {
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${config.searchUrl}?q={search_term_string}`,
                    'query-input': 'required name=search_term_string'
                }
            })
        };
        this.injectSchema(schema);
    }

    /**
     * Generate and inject WebPage schema
     */
    setWebPageSchema(config: {
        name: string;
        description: string;
        url: string;
        dateModified?: string;
        language?: string;
        type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'FAQPage' | 'CollectionPage';
    }): void {
        const schema: WebPageSchema = {
            '@context': 'https://schema.org',
            '@type': config.type || 'WebPage',
            name: config.name,
            description: config.description,
            url: config.url,
            ...(config.dateModified && { dateModified: config.dateModified }),
            ...(config.language && { inLanguage: config.language })
        };
        this.injectSchema(schema);
    }

    /**
     * Generate and inject BreadcrumbList schema
     */
    setBreadcrumbSchema(items: Array<{ name: string; url?: string }>): void {
        const itemListElement: BreadcrumbItem[] = items.map((item, index) => ({
            '@type': 'ListItem' as const,
            position: index + 1,
            name: item.name,
            ...(item.url && { item: item.url })
        }));

        const schema: BreadcrumbListSchema = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement
        };
        this.injectSchema(schema);
    }

    /**
     * Generate and inject Article schema
     */
    setArticleSchema(config: {
        headline: string;
        description?: string;
        image?: string;
        datePublished: string;
        dateModified?: string;
        authorName: string;
        publisherName: string;
        publisherLogo: string;
        url?: string;
    }): void {
        const schema: ArticleSchema = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: config.headline,
            ...(config.description && { description: config.description }),
            ...(config.image && { image: config.image }),
            datePublished: config.datePublished,
            ...(config.dateModified && { dateModified: config.dateModified }),
            author: {
                '@type': 'Person',
                name: config.authorName
            },
            publisher: {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: config.publisherName,
                logo: config.publisherLogo
            },
            ...(config.url && { mainEntityOfPage: config.url })
        };
        this.injectSchema(schema);
    }

    /**
     * Generate and inject FAQPage schema
     * Automatically detects FAQ content blocks
     */
    setFAQSchema(faqs: Array<{ question: string; answer: string }>): void {
        const mainEntity: FAQItem[] = faqs.map(faq => ({
            '@type': 'Question' as const,
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer' as const,
                text: faq.answer
            }
        }));

        const schema: FAQPageSchema = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity
        };
        this.injectSchema(schema);
    }

    /**
     * Set multiple schemas at once (combined in an array)
     */
    setMultipleSchemas(schemas: JsonLdContext[]): void {
        this.injectSchema(schemas);
    }

    /**
     * Generate combined page schema with WebPage + Breadcrumb + optional FAQ
     */
    setFullPageSchema(config: {
        page: {
            name: string;
            description: string;
            url: string;
            dateModified?: string;
            language?: string;
            type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'FAQPage' | 'CollectionPage';
        };
        breadcrumbs?: Array<{ name: string; url?: string }>;
        faqs?: Array<{ question: string; answer: string }>;
        organization?: {
            name: string;
            url: string;
            logo?: string;
        };
    }): void {
        const schemas: JsonLdContext[] = [];

        // WebPage schema
        const pageSchema: WebPageSchema = {
            '@context': 'https://schema.org',
            '@type': config.page.type || 'WebPage',
            name: config.page.name,
            description: config.page.description,
            url: config.page.url,
            ...(config.page.dateModified && { dateModified: config.page.dateModified }),
            ...(config.page.language && { inLanguage: config.page.language })
        };
        schemas.push(pageSchema);

        // Breadcrumb schema
        if (config.breadcrumbs && config.breadcrumbs.length > 0) {
            const breadcrumbSchema: BreadcrumbListSchema = {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: config.breadcrumbs.map((item, index) => ({
                    '@type': 'ListItem' as const,
                    position: index + 1,
                    name: item.name,
                    ...(item.url && { item: item.url })
                }))
            };
            schemas.push(breadcrumbSchema);
        }

        // FAQ schema
        if (config.faqs && config.faqs.length > 0) {
            const faqSchema: FAQPageSchema = {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: config.faqs.map(faq => ({
                    '@type': 'Question' as const,
                    name: faq.question,
                    acceptedAnswer: {
                        '@type': 'Answer' as const,
                        text: faq.answer
                    }
                }))
            };
            schemas.push(faqSchema);
        }

        // Organization schema
        if (config.organization) {
            const orgSchema: OrganizationSchema = {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: config.organization.name,
                url: config.organization.url,
                ...(config.organization.logo && { logo: config.organization.logo })
            };
            schemas.push(orgSchema);
        }

        this.injectSchema(schemas);
    }
}
