export interface BlockProperty {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    title?: string;
    description?: string;
    default?: any;
    enum?: any[];
    ui?: {
        widget?: 'text' | 'textarea' | 'color' | 'image' | 'date' | 'select' | 'toggle' | 'range' | 'rich-text';
        placeholder?: string;
        hidden?: boolean;
    };

    // For Arrays
    items?: BlockProperty;

    // For Objects
    properties?: Record<string, BlockProperty>;
}

export interface BlockSchema {
    properties: Record<string, BlockProperty>;
    required?: string[];
    groups?: {
        title: string;
        fields: string[];
    }[];
}

export interface ContentBlockManifest {
    type: string;
    displayName: string;
    category: string;
    version?: string;
    thumbnail?: string;
    description?: string;
    schema: BlockSchema;
    styleSchema?: BlockSchema;
}

export interface BlockInstance {
    type: string;
    id: string;
    data: Record<string, any>;
    styles?: Record<string, any>;
    children?: BlockInstance[];
}
