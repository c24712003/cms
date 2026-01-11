import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Image Optimization Configuration
 */
export interface ImageOptimizationConfig {
    generateWebP: boolean;
    generateResponsive: boolean;
    responsiveSizes: number[];
    quality: number;
    maxWidth: number;
    maxHeight: number;
}

/**
 * Optimized Image Result
 */
export interface OptimizedImage {
    original: string;
    webp?: string;
    responsive?: ResponsiveImage[];
    width?: number;
    height?: number;
    size?: number;
}

export interface ResponsiveImage {
    width: number;
    url: string;
    webpUrl?: string;
}

/**
 * Image Optimization Service
 * Handles client-side image optimization utilities
 */
@Injectable({
    providedIn: 'root'
})
export class ImageOptimizationService {

    private readonly DEFAULT_CONFIG: ImageOptimizationConfig = {
        generateWebP: true,
        generateResponsive: true,
        responsiveSizes: [320, 640, 768, 1024, 1280, 1920],
        quality: 85,
        maxWidth: 2560,
        maxHeight: 2560
    };

    constructor(private http: HttpClient) { }

    /**
     * Generate srcset attribute for responsive images
     */
    generateSrcset(imageUrl: string, sizes: number[] = this.DEFAULT_CONFIG.responsiveSizes): string {
        // If the server supports responsive images, generate srcset
        // Format: /uploads/image-320w.jpg 320w, /uploads/image-640w.jpg 640w, ...

        if (!imageUrl) return '';

        const extension = imageUrl.split('.').pop();
        const basePath = imageUrl.replace(`.${extension}`, '');

        return sizes
            .map(size => `${basePath}-${size}w.${extension} ${size}w`)
            .join(', ');
    }

    /**
     * Generate WebP URL from original image URL
     */
    getWebPUrl(imageUrl: string): string {
        if (!imageUrl) return '';

        const extension = imageUrl.split('.').pop();
        if (extension === 'webp') return imageUrl;

        return imageUrl.replace(`.${extension}`, '.webp');
    }

    /**
     * Generate picture element HTML for optimal image loading
     */
    generatePictureHtml(config: {
        src: string;
        alt: string;
        width?: number;
        height?: number;
        loading?: 'lazy' | 'eager';
        fetchpriority?: 'high' | 'low' | 'auto';
        sizes?: string;
        className?: string;
    }): string {
        const {
            src, alt, width, height,
            loading = 'lazy',
            fetchpriority = 'auto',
            sizes = '100vw',
            className = ''
        } = config;

        const webpSrc = this.getWebPUrl(src);
        const srcset = this.generateSrcset(src);
        const webpSrcset = this.generateSrcset(webpSrc);

        const imgAttrs = [
            `src="${src}"`,
            `alt="${this.escapeHtml(alt)}"`,
            width ? `width="${width}"` : '',
            height ? `height="${height}"` : '',
            `loading="${loading}"`,
            fetchpriority !== 'auto' ? `fetchpriority="${fetchpriority}"` : '',
            srcset ? `srcset="${srcset}"` : '',
            sizes ? `sizes="${sizes}"` : '',
            className ? `class="${className}"` : ''
        ].filter(Boolean).join(' ');

        // If WebP is available, use picture element
        if (webpSrc !== src) {
            return `
                <picture>
                    <source type="image/webp" srcset="${webpSrcset}" sizes="${sizes}">
                    <source type="image/${this.getMimeType(src)}" srcset="${srcset}" sizes="${sizes}">
                    <img ${imgAttrs}>
                </picture>
            `.trim();
        }

        return `<img ${imgAttrs}>`;
    }

    /**
     * Get aspect ratio placeholder style for CLS prevention
     */
    getAspectRatioStyle(width: number, height: number): string {
        if (!width || !height) return '';
        const ratio = (height / width) * 100;
        return `aspect-ratio: ${width}/${height}; width: 100%;`;
    }

    /**
     * Check if browser supports WebP
     */
    supportsWebP(): Promise<boolean> {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    /**
     * Get MIME type from file extension
     */
    private getMimeType(url: string): string {
        const ext = url.split('.').pop()?.toLowerCase();
        const mimeTypes: Record<string, string> = {
            'jpg': 'jpeg',
            'jpeg': 'jpeg',
            'png': 'png',
            'gif': 'gif',
            'webp': 'webp',
            'svg': 'svg+xml'
        };
        return mimeTypes[ext || ''] || 'jpeg';
    }

    /**
     * Escape HTML for alt text
     */
    private escapeHtml(str: string): string {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Calculate optimal image sizes based on viewport
     */
    getOptimalSize(containerWidth: number, devicePixelRatio: number = 1): number {
        const sizes = this.DEFAULT_CONFIG.responsiveSizes;
        const targetWidth = containerWidth * devicePixelRatio;

        // Find the smallest size that is >= targetWidth
        for (const size of sizes) {
            if (size >= targetWidth) return size;
        }

        // Return largest if all are smaller
        return sizes[sizes.length - 1];
    }

    /**
     * Preload critical images
     */
    preloadImage(url: string, as: 'image' = 'image'): void {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = as;
        link.href = url;

        // Add WebP alternative
        if (!url.endsWith('.webp')) {
            const webpUrl = this.getWebPUrl(url);
            link.setAttribute('imagesrcset', `${webpUrl} type="image/webp"`);
        }

        document.head.appendChild(link);
    }
}
