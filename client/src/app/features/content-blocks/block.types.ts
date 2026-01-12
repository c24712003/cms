export interface BlockProperty {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    title?: string;
    description?: string;
    default?: any;
    enum?: any[];
    ui?: {
        widget?: 'text' | 'textarea' | 'color' | 'image' | 'date' | 'select' | 'toggle' | 'range' | 'rich-text' | 'array';
        placeholder?: string;
        hidden?: boolean;
        addLabel?: string;
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
    previewImage?: string;
    description?: string;
    schema: BlockSchema;
    styleSchema?: BlockSchema;
}



export interface BlockStyleProps {
    spacing?: {
        padding: string[]; // [top, right, bottom, left]
        margin: string[];
    };
    typography?: {
        fontSize?: string;
        fontWeight?: string;
        lineHeight?: string;
        textAlign?: 'left' | 'center' | 'right' | 'justify';
        fontFamily?: string;
        color?: string;
    };
    background?: {
        color?: string;
        image?: string;
        overlayOpacity?: number;
        position?: string;
    };
    border?: {
        radius?: string;
        width?: string;
        color?: string;
        style?: string;
    };
    layout?: {
        display?: string;
        flexDirection?: string;
        justifyContent?: string;
        alignItems?: string;
        gap?: string;
        itemsPerLine?: number; // For grids
    };
    size?: {
        width?: string;
        height?: string;
        maxWidth?: string;
    };
}

export interface BlockAnimation {
    type: 'fade-up' | 'zoom-in' | 'slide-right' | 'slide-left' | 'none';
    duration?: number;
    delay?: number;
    trigger?: 'visible' | 'hover' | 'click';
}

export interface BlockSettings {
    animation?: BlockAnimation;
    visibility?: {
        hideOnMobile?: boolean;
        hideOnTablet?: boolean;
        hideOnDesktop?: boolean;
        requiresAuth?: boolean;
    };
    customClass?: string;
    id?: string; // HTML ID
}

export interface BlockInstance {
    type: string;
    id: string;
    data: Record<string, any>;

    // 🎨 New: Styling Layer
    styles?: {
        desktop?: BlockStyleProps;
        tablet?: BlockStyleProps;
        mobile?: BlockStyleProps;
        customCss?: string; // User-written CSS (Advanced mode)
        hover?: BlockStyleProps; // Hover state styles
    };

    // ✨ New: Interactive Layer
    settings?: BlockSettings;

    children?: BlockInstance[];
}
