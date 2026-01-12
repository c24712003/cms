export interface TemplateVariable {
    key: string;
    label: string;
    defaultValue: string;
    type?: 'text' | 'color' | 'image';
}

export interface TemplatePageDefinition {
    slug: string;
    template: string;
    title: string;
    structure: any[];
}

export interface BoardingTemplate {
    id: string;
    name: string;
    description: string;
    category: 'Corporate' | 'Portfolio' | 'Landing' | 'E-commerce' | 'SaaS' | 'Other';
    thumbnail: string;
    tags: string[];
    pages: TemplatePageDefinition[];
    variables: TemplateVariable[];
}
