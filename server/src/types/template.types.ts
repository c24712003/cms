export interface TemplateVariable {
    key: string;
    label: string;
    defaultValue: string;
    type?: 'text' | 'color' | 'image';
}

export interface TemplatePageDefinition {
    slug: string; // e.g., 'home', 'about'
    template: string; // e.g., 'home', 'default', 'contact'
    title: string; // Default English title
    structure: any[]; // Content blocks
}

export interface BoardingTemplate {
    id: string;
    name: string;
    description: string;
    category: 'Corporate' | 'Portfolio' | 'Landing' | 'E-commerce' | 'SaaS' | 'Other';
    thumbnail: string;
    tags: string[];
    pages: TemplatePageDefinition[]; // Multi-page support
    variables: TemplateVariable[];
}
