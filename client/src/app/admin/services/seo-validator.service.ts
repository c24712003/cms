import { Injectable } from '@angular/core';

/**
 * SEO Validation Result
 */
export interface SeoValidationResult {
    field: string;
    isValid: boolean;
    message: string;
    severity: 'error' | 'warning' | 'info';
    currentLength?: number;
    recommendedLength?: { min: number; max: number };
}

/**
 * SEO Validation Summary
 */
export interface SeoValidationSummary {
    isValid: boolean;
    errors: SeoValidationResult[];
    warnings: SeoValidationResult[];
    info: SeoValidationResult[];
    score: number; // 0-100
}

/**
 * SEO Validator Service
 * Validates SEO fields and provides recommendations
 */
@Injectable({
    providedIn: 'root'
})
export class SeoValidatorService {

    // SEO Field Length Recommendations
    private readonly TITLE_MIN = 30;
    private readonly TITLE_MAX_EN = 60;
    private readonly TITLE_MAX_CJK = 30; // Chinese/Japanese/Korean

    private readonly DESC_MIN = 120;
    private readonly DESC_MAX = 160;

    /**
     * Validate SEO Title
     */
    validateTitle(title: string, language: string = 'en'): SeoValidationResult {
        const isCJK = ['zh-TW', 'ja', 'ko'].includes(language);
        const maxLength = isCJK ? this.TITLE_MAX_CJK : this.TITLE_MAX_EN;
        const length = title?.length || 0;

        if (!title || title.trim() === '') {
            return {
                field: 'title',
                isValid: false,
                message: 'SEO 標題為必填項目',
                severity: 'error',
                currentLength: 0,
                recommendedLength: { min: this.TITLE_MIN, max: maxLength }
            };
        }

        if (length < this.TITLE_MIN) {
            return {
                field: 'title',
                isValid: false,
                message: `標題過短 (${length}/${this.TITLE_MIN} 字元)，建議增加更多關鍵字描述`,
                severity: 'warning',
                currentLength: length,
                recommendedLength: { min: this.TITLE_MIN, max: maxLength }
            };
        }

        if (length > maxLength) {
            return {
                field: 'title',
                isValid: false,
                message: `標題過長 (${length}/${maxLength} 字元)，可能在搜尋結果中被截斷`,
                severity: 'warning',
                currentLength: length,
                recommendedLength: { min: this.TITLE_MIN, max: maxLength }
            };
        }

        return {
            field: 'title',
            isValid: true,
            message: `標題長度適中 (${length}/${maxLength} 字元)`,
            severity: 'info',
            currentLength: length,
            recommendedLength: { min: this.TITLE_MIN, max: maxLength }
        };
    }

    /**
     * Validate Meta Description
     */
    validateDescription(description: string): SeoValidationResult {
        const length = description?.length || 0;

        if (!description || description.trim() === '') {
            return {
                field: 'description',
                isValid: false,
                message: 'Meta Description 為必填項目，對點擊率有重大影響',
                severity: 'error',
                currentLength: 0,
                recommendedLength: { min: this.DESC_MIN, max: this.DESC_MAX }
            };
        }

        if (length < this.DESC_MIN) {
            return {
                field: 'description',
                isValid: false,
                message: `描述過短 (${length}/${this.DESC_MIN} 字元)，建議補充更多內容摘要`,
                severity: 'warning',
                currentLength: length,
                recommendedLength: { min: this.DESC_MIN, max: this.DESC_MAX }
            };
        }

        if (length > this.DESC_MAX) {
            return {
                field: 'description',
                isValid: false,
                message: `描述過長 (${length}/${this.DESC_MAX} 字元)，超出部分將被省略`,
                severity: 'warning',
                currentLength: length,
                recommendedLength: { min: this.DESC_MIN, max: this.DESC_MAX }
            };
        }

        return {
            field: 'description',
            isValid: true,
            message: `描述長度適中 (${length}/${this.DESC_MAX} 字元)`,
            severity: 'info',
            currentLength: length,
            recommendedLength: { min: this.DESC_MIN, max: this.DESC_MAX }
        };
    }

    /**
     * Validate Alt Text for images
     */
    validateAltText(altText: string): SeoValidationResult {
        if (!altText || altText.trim() === '') {
            return {
                field: 'alt',
                isValid: false,
                message: 'Alt 文字為必填，對無障礙與圖片 SEO 至關重要',
                severity: 'error'
            };
        }

        if (altText.length < 5) {
            return {
                field: 'alt',
                isValid: false,
                message: 'Alt 文字應描述圖片內容，建議至少 5 個字元',
                severity: 'warning'
            };
        }

        if (altText.length > 125) {
            return {
                field: 'alt',
                isValid: true,
                message: 'Alt 文字可能過長，建議控制在 125 字元內',
                severity: 'info'
            };
        }

        return {
            field: 'alt',
            isValid: true,
            message: 'Alt 文字符合規範',
            severity: 'info'
        };
    }

    /**
     * Validate H1 tag - should be unique per page
     */
    validateH1(content: any[]): SeoValidationResult {
        let h1Count = 0;

        // Count H1 in content blocks
        const countH1InContent = (blocks: any[]) => {
            if (!Array.isArray(blocks)) return;

            blocks.forEach(block => {
                // Check for page-hero or other blocks that might have H1
                if (block.type === 'page-hero' || block.type === 'hero-carousel') {
                    h1Count++; // These typically render as H1
                }
                // Check nested content
                if (block.slides) countH1InContent(block.slides);
                if (block.items) countH1InContent(block.items);
            });
        };

        countH1InContent(content);

        if (h1Count === 0) {
            return {
                field: 'h1',
                isValid: false,
                message: '頁面缺少 H1 標籤，每頁應有且僅有一個 H1',
                severity: 'error'
            };
        }

        if (h1Count > 1) {
            return {
                field: 'h1',
                isValid: false,
                message: `頁面有 ${h1Count} 個 H1 標籤，建議每頁只保留一個`,
                severity: 'warning'
            };
        }

        return {
            field: 'h1',
            isValid: true,
            message: 'H1 標籤配置正確',
            severity: 'info'
        };
    }

    /**
     * Check for images without alt text in content
     */
    validateContentImages(content: any[]): SeoValidationResult[] {
        const results: SeoValidationResult[] = [];

        const checkImages = (blocks: any[], path: string = '') => {
            if (!Array.isArray(blocks)) return;

            blocks.forEach((block, index) => {
                const blockPath = path ? `${path}[${index}]` : `block[${index}]`;

                // Check for image fields
                if (block.image && !block.alt && !block.altText) {
                    results.push({
                        field: `${blockPath}.image`,
                        isValid: false,
                        message: `圖片缺少 Alt 文字: ${block.image}`,
                        severity: 'warning'
                    });
                }

                // Check nested
                if (block.slides) checkImages(block.slides, `${blockPath}.slides`);
                if (block.items) checkImages(block.items, `${blockPath}.items`);
                if (block.cards) checkImages(block.cards, `${blockPath}.cards`);
                if (block.cases) checkImages(block.cases, `${blockPath}.cases`);
            });
        };

        checkImages(content);
        return results;
    }

    /**
     * Full page SEO validation
     */
    validatePage(config: {
        title?: string;
        description?: string;
        content?: any[];
        language?: string;
    }): SeoValidationSummary {
        const results: SeoValidationResult[] = [];

        // Validate title
        results.push(this.validateTitle(config.title || '', config.language));

        // Validate description
        results.push(this.validateDescription(config.description || ''));

        // Validate H1
        if (config.content) {
            results.push(this.validateH1(config.content));

            // Validate images
            const imageResults = this.validateContentImages(config.content);
            results.push(...imageResults);
        }

        // Categorize results
        const errors = results.filter(r => r.severity === 'error');
        const warnings = results.filter(r => r.severity === 'warning');
        const info = results.filter(r => r.severity === 'info');

        // Calculate score (100 points total)
        let score = 100;
        score -= errors.length * 20;
        score -= warnings.length * 10;
        score = Math.max(0, Math.min(100, score));

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            info,
            score
        };
    }

    /**
     * Get SEO score color
     */
    getScoreColor(score: number): string {
        if (score >= 90) return '#22c55e'; // Green
        if (score >= 70) return '#eab308'; // Yellow
        if (score >= 50) return '#f97316'; // Orange
        return '#ef4444'; // Red
    }

    /**
     * Get SEO score label
     */
    getScoreLabel(score: number): string {
        if (score >= 90) return '優秀';
        if (score >= 70) return '良好';
        if (score >= 50) return '需改進';
        return '待優化';
    }
}
