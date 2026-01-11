/**
 * Schema.org Type Definitions for JSON-LD Structured Data
 * Following Schema.org specifications
 */

// Base JSON-LD context
export interface JsonLdContext {
    '@context': string;
    '@type': string;
}

// Organization Schema
export interface OrganizationSchema extends JsonLdContext {
    '@type': 'Organization';
    name: string;
    url?: string;
    logo?: string | ImageObject;
    sameAs?: string[];
    contactPoint?: ContactPoint[];
    address?: PostalAddress;
}

// WebSite Schema (with SearchAction for sitelinks searchbox)
export interface WebSiteSchema extends JsonLdContext {
    '@type': 'WebSite';
    name: string;
    url: string;
    potentialAction?: SearchAction;
    publisher?: OrganizationSchema;
}

// WebPage Schema
export interface WebPageSchema extends JsonLdContext {
    '@type': 'WebPage' | 'AboutPage' | 'ContactPage' | 'FAQPage' | 'CollectionPage';
    name: string;
    description?: string;
    url: string;
    datePublished?: string;
    dateModified?: string;
    inLanguage?: string;
    isPartOf?: WebSiteSchema;
    breadcrumb?: BreadcrumbListSchema;
    mainEntity?: any;
}

// Article Schema
export interface ArticleSchema extends JsonLdContext {
    '@type': 'Article' | 'NewsArticle' | 'BlogPosting';
    headline: string;
    description?: string;
    image?: string | string[] | ImageObject;
    datePublished: string;
    dateModified?: string;
    author: Person | Organization;
    publisher: OrganizationSchema;
    mainEntityOfPage?: string;
    articleBody?: string;
    keywords?: string[];
}

// BreadcrumbList Schema
export interface BreadcrumbListSchema extends JsonLdContext {
    '@type': 'BreadcrumbList';
    itemListElement: BreadcrumbItem[];
}

export interface BreadcrumbItem {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string; // URL
}

// FAQ Schema
export interface FAQPageSchema extends JsonLdContext {
    '@type': 'FAQPage';
    mainEntity: FAQItem[];
}

export interface FAQItem {
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
        '@type': 'Answer';
        text: string;
    };
}

// Product Schema (for e-commerce)
export interface ProductSchema extends JsonLdContext {
    '@type': 'Product';
    name: string;
    description?: string;
    image?: string | string[];
    sku?: string;
    brand?: Brand;
    offers?: Offer | Offer[];
    aggregateRating?: AggregateRating;
    review?: Review[];
}

// LocalBusiness Schema
export interface LocalBusinessSchema extends JsonLdContext {
    '@type': 'LocalBusiness' | 'Restaurant' | 'Store';
    name: string;
    address: PostalAddress;
    telephone?: string;
    openingHoursSpecification?: OpeningHours[];
    geo?: GeoCoordinates;
    priceRange?: string;
}

// Supporting Types
export interface ImageObject {
    '@type': 'ImageObject';
    url: string;
    width?: number;
    height?: number;
}

export interface Person {
    '@type': 'Person';
    name: string;
    url?: string;
}

export interface Organization {
    '@type': 'Organization';
    name: string;
    url?: string;
    logo?: string;
}

export interface ContactPoint {
    '@type': 'ContactPoint';
    contactType: string;
    telephone?: string;
    email?: string;
    areaServed?: string;
    availableLanguage?: string[];
}

export interface PostalAddress {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
}

export interface SearchAction {
    '@type': 'SearchAction';
    target: string | {
        '@type': 'EntryPoint';
        urlTemplate: string;
    };
    'query-input': string;
}

export interface Brand {
    '@type': 'Brand';
    name: string;
}

export interface Offer {
    '@type': 'Offer';
    price: string | number;
    priceCurrency: string;
    availability?: string;
    url?: string;
    priceValidUntil?: string;
}

export interface AggregateRating {
    '@type': 'AggregateRating';
    ratingValue: string | number;
    reviewCount: string | number;
    bestRating?: string | number;
    worstRating?: string | number;
}

export interface Review {
    '@type': 'Review';
    author: Person;
    reviewRating: {
        '@type': 'Rating';
        ratingValue: string | number;
    };
    reviewBody?: string;
}

export interface OpeningHours {
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string[];
    opens: string;
    closes: string;
}

export interface GeoCoordinates {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
}

// Schema type mapping for page templates
export type SchemaType =
    | 'WebPage'
    | 'Article'
    | 'FAQPage'
    | 'Product'
    | 'LocalBusiness'
    | 'Organization'
    | 'AboutPage'
    | 'ContactPage'
    | 'CollectionPage';
