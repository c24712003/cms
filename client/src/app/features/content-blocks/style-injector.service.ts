import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { BlockInstance, BlockStyleProps } from './block.types';

@Injectable({
    providedIn: 'root'
})
export class StyleInjectorService {
    private injectedStyles = new Set<string>();

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    /**
     * Generates and injects CSS for a specific block instance.
     * Returns the scope selector string (e.g. `[data-block-id="..."]`)
     */
    injectBlockStyles(block: BlockInstance): void {
        if (!isPlatformBrowser(this.platformId)) return; // Skip if not in browser (SSR handling to be added later)
        if (!block.styles) return;

        const scopeSelector = `[data-block-id="${block.id}"]`;
        let css = '';

        // Desktop Styles (Default)
        if (block.styles.desktop) {
            css += this.generateCssRule(scopeSelector, block.styles.desktop);
        }

        // Tablet Styles (max-width: 768px)
        if (block.styles.tablet) {
            css += `@media(max-width: 768px) {
                ${this.generateCssRule(scopeSelector, block.styles.tablet)}
            }`;
        }

        // Mobile Styles (max-width: 480px)
        if (block.styles.mobile) {
            css += `@media(max-width: 480px) {
                ${this.generateCssRule(scopeSelector, block.styles.mobile)}
            }`;
        }

        // Custom CSS (Advanced)
        if (block.styles.customCss) {
            // Very basic scoping for custom CSS.
            // Ideally use specific parser to prefix selectors. 
            // Here we assume user writes properties or uses & selector-like logic if we were using a preprocessor,
            // but for raw CSS we often just wrap it. 
            // Simple approach: wrap in scope selector
            css += `${scopeSelector} { ${this.sanitize(block.styles.customCss)} }`;
        }

        this.injectStyleTag(block.id, css);
    }

    removeBlockStyles(blockId: string): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const styleId = `style-block-${blockId}`;
        const existingElement = this.document.getElementById(styleId);
        if (existingElement) {
            existingElement.remove();
            this.injectedStyles.delete(blockId);
        }
    }

    private generateCssRule(selector: string, props: BlockStyleProps): string {
        const declarations: string[] = [];

        if (props.spacing) {
            if (props.spacing.padding) {
                const p = props.spacing.padding;
                declarations.push(`padding: ${Array.isArray(p) ? p.join(' ') : p}`);
            }
            if (props.spacing.margin) {
                const m = props.spacing.margin;
                declarations.push(`margin: ${Array.isArray(m) ? m.join(' ') : m}`);
            }
        }

        if (props.typography) {
            const t = props.typography;
            if (t.fontSize) declarations.push(`font-size: ${t.fontSize}`);
            if (t.fontWeight) declarations.push(`font-weight: ${t.fontWeight}`);
            if (t.lineHeight) declarations.push(`line-height: ${t.lineHeight}`);
            if (t.textAlign) declarations.push(`text-align: ${t.textAlign}`);
            if (t.fontFamily) declarations.push(`font-family: ${t.fontFamily}`);
            if (t.color) declarations.push(`color: ${t.color}`);
        }

        if (props.background) {
            const b = props.background;
            if (b.color) declarations.push(`background-color: ${b.color}`);
            if (b.image) declarations.push(`background-image: url('${b.image}')`);
            if (b.position) declarations.push(`background-position: ${b.position}`);
            // Note: Overlay opacity would typically require a pseudo-element or separate logic
        }

        if (props.border) {
            const br = props.border;
            if (br.width || br.style || br.color) {
                declarations.push(`border: ${br.width || '1px'} ${br.style || 'solid'} ${br.color || 'transparent'}`);
            }
            if (br.radius) declarations.push(`border-radius: ${br.radius}`);
        }

        if (props.layout) {
            const l = props.layout;
            if (l.display) declarations.push(`display: ${l.display}`);
            if (l.flexDirection) declarations.push(`flex-direction: ${l.flexDirection}`);
            if (l.justifyContent) declarations.push(`justify-content: ${l.justifyContent}`);
            if (l.alignItems) declarations.push(`align-items: ${l.alignItems}`);
            if (l.gap) declarations.push(`gap: ${l.gap}`);
        }

        if (props.size) {
            const s = props.size;
            if (s.width) declarations.push(`width: ${s.width}`);
            if (s.height) declarations.push(`height: ${s.height}`);
            if (s.maxWidth) declarations.push(`max-width: ${s.maxWidth}`);
        }

        if (declarations.length === 0) return '';
        return `${selector} { ${declarations.join('; ')} }`;
    }

    private injectStyleTag(blockId: string, cssContent: string): void {
        const styleId = `style-block-${blockId}`;
        let styleElement = this.document.getElementById(styleId) as HTMLStyleElement;

        if (!styleElement) {
            styleElement = this.document.createElement('style');
            styleElement.id = styleId;
            this.document.head.appendChild(styleElement);
        }

        if (styleElement.innerHTML !== cssContent) {
            styleElement.innerHTML = cssContent;
        }

        this.injectedStyles.add(blockId);
    }

    private sanitize(css: string): string {
        // Basic sanitization to prevent breaking out of syntax or obvious bad attributes
        // Real-world requires a robust CSS parser/purifier
        return css.replace(/<\/style>/gi, '') // Prevent tag closing injection
            .replace(/expression\(/gi, '') // IE expression
            .replace(/javascript:/gi, ''); // URLs
    }
}
