import { Injectable, inject } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { CssValidationResult, CssValidationError } from './block.types';

/**
 * Centralized CSS validation and sanitization service.
 * Provides security checks for user-provided CSS to prevent XSS attacks.
 */
@Injectable({
    providedIn: 'root'
})
export class StyleValidatorService {
    private sanitizer = inject(DomSanitizer);

    /**
     * Dangerous CSS patterns that could be used for XSS attacks
     */
    private readonly DANGEROUS_PATTERNS: { pattern: RegExp; message: string }[] = [
        { pattern: /expression\s*\(/i, message: 'STYLE_ERROR_EXPRESSION' },
        { pattern: /javascript:/i, message: 'STYLE_ERROR_JAVASCRIPT_URL' },
        { pattern: /behavior\s*:/i, message: 'STYLE_ERROR_BEHAVIOR' },
        { pattern: /-moz-binding\s*:/i, message: 'STYLE_ERROR_MOZ_BINDING' },
        { pattern: /url\s*\(\s*["']?\s*data:\s*text\/html/i, message: 'STYLE_ERROR_DATA_URL' },
        { pattern: /<\/?script/i, message: 'STYLE_ERROR_SCRIPT_TAG' },
        { pattern: /<\/?style/i, message: 'STYLE_ERROR_STYLE_TAG' },
        { pattern: /on\w+\s*=/i, message: 'STYLE_ERROR_EVENT_HANDLER' },
        { pattern: /\\[0-9a-f]/i, message: 'STYLE_ERROR_UNICODE_ESCAPE' },
    ];

    /**
     * Valid characters for CSS class names
     */
    private readonly VALID_CLASS_CHARS = /^[a-zA-Z0-9_\-\s]+$/;

    /**
     * Validates and sanitizes inline CSS styles
     */
    validateInlineStyles(raw: string): CssValidationResult {
        const errors: CssValidationError[] = [];
        let sanitizedValue = raw?.trim() || '';

        if (!sanitizedValue) {
            return { isValid: true, errors: [], sanitizedValue: '' };
        }

        // Check for dangerous patterns
        for (const { pattern, message } of this.DANGEROUS_PATTERNS) {
            if (pattern.test(sanitizedValue)) {
                errors.push({
                    message,
                    severity: 'error'
                });
                // Remove the dangerous pattern
                sanitizedValue = sanitizedValue.replace(pattern, '');
            }
        }

        // Basic syntax validation - check for unclosed brackets/parentheses
        const openParens = (sanitizedValue.match(/\(/g) || []).length;
        const closeParens = (sanitizedValue.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
            errors.push({
                message: 'STYLE_ERROR_UNBALANCED_PARENS',
                severity: 'warning'
            });
        }

        // Warn about !important usage
        if (/!important/i.test(sanitizedValue)) {
            errors.push({
                message: 'STYLE_WARNING_IMPORTANT',
                severity: 'warning'
            });
        }

        return {
            isValid: errors.filter(e => e.severity === 'error').length === 0,
            errors,
            sanitizedValue
        };
    }

    /**
     * Validates CSS class names
     */
    validateClasses(raw: string): CssValidationResult {
        const errors: CssValidationError[] = [];
        let sanitizedValue = raw?.trim() || '';

        if (!sanitizedValue) {
            return { isValid: true, errors: [], sanitizedValue: '' };
        }

        // Validate each class name
        const classes = sanitizedValue.split(/\s+/);
        const validClasses: string[] = [];

        for (const className of classes) {
            if (!className) continue;

            if (!this.VALID_CLASS_CHARS.test(className)) {
                errors.push({
                    message: `STYLE_ERROR_INVALID_CLASS_CHAR`,
                    severity: 'error'
                });
            } else if (className.startsWith('-') && className.charAt(1) >= '0' && className.charAt(1) <= '9') {
                // Class names cannot start with a hyphen followed by a digit
                errors.push({
                    message: 'STYLE_ERROR_INVALID_CLASS_START',
                    severity: 'error'
                });
            } else {
                validClasses.push(className);
            }
        }

        return {
            isValid: errors.filter(e => e.severity === 'error').length === 0,
            errors,
            sanitizedValue: validClasses.join(' ')
        };
    }

    /**
     * Validates custom CSS rules (for scoped CSS)
     */
    validateCustomCss(raw: string): CssValidationResult {
        const errors: CssValidationError[] = [];
        let sanitizedValue = raw?.trim() || '';

        if (!sanitizedValue) {
            return { isValid: true, errors: [], sanitizedValue: '' };
        }

        // Check for dangerous patterns
        for (const { pattern, message } of this.DANGEROUS_PATTERNS) {
            if (pattern.test(sanitizedValue)) {
                errors.push({
                    message,
                    severity: 'error'
                });
                sanitizedValue = sanitizedValue.replace(new RegExp(pattern, 'gi'), '');
            }
        }

        // Prevent closing style tags
        sanitizedValue = sanitizedValue.replace(/<\/style>/gi, '');

        // Check for balanced braces
        const openBraces = (sanitizedValue.match(/\{/g) || []).length;
        const closeBraces = (sanitizedValue.match(/\}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push({
                message: 'STYLE_ERROR_UNBALANCED_BRACES',
                severity: 'warning'
            });
        }

        return {
            isValid: errors.filter(e => e.severity === 'error').length === 0,
            errors,
            sanitizedValue
        };
    }

    /**
     * Creates a SafeStyle object for Angular binding
     */
    sanitizeForBinding(style: string): SafeStyle {
        const validation = this.validateInlineStyles(style);
        return this.sanitizer.bypassSecurityTrustStyle(validation.sanitizedValue);
    }

    /**
     * Extracts dangerous patterns found in CSS
     */
    extractDangerousPatterns(css: string): string[] {
        const found: string[] = [];
        for (const { pattern, message } of this.DANGEROUS_PATTERNS) {
            if (pattern.test(css)) {
                found.push(message);
            }
        }
        return found;
    }
}
