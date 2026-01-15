import { Request, Response, NextFunction } from 'express';

const SUPPORTED_LANGS = ['en-US', 'zh-TW', 'ja', 'ko'];
const DEFAULT_LANG = 'en-US';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            detectedLang?: string;
        }
    }
}

/**
 * Language detection middleware
 * Order of priority:
 * 1. Cookie (preferred_lang)
 * 2. Accept-Language header
 * 3. Default (en-US)
 * 
 * Sets Vary header for proper caching
 */
export function languageMiddleware(req: Request, res: Response, next: NextFunction) {
    // Set Vary header for proper caching
    res.setHeader('Vary', 'Accept-Language, Cookie');

    // 1. Check cookie
    const cookies = parseCookies(req.headers.cookie || '');
    const cookieLang = cookies['preferred_lang'];
    if (cookieLang && SUPPORTED_LANGS.includes(cookieLang)) {
        req.detectedLang = cookieLang;
        return next();
    }

    // 2. Parse Accept-Language header
    const acceptLang = req.headers['accept-language'];
    if (acceptLang) {
        const preferred = parseAcceptLanguage(acceptLang);
        const match = findMatchingLanguage(preferred, SUPPORTED_LANGS);
        if (match) {
            req.detectedLang = match;
            return next();
        }
    }

    // 3. Default
    req.detectedLang = DEFAULT_LANG;
    next();
}

/**
 * Parse Accept-Language header into ordered array of language codes
 */
function parseAcceptLanguage(header: string): string[] {
    return header.split(',')
        .map(lang => {
            const parts = lang.trim().split(';');
            const code = parts[0].trim();
            const qPart = parts.find(p => p.trim().startsWith('q='));
            const q = qPart ? parseFloat(qPart.split('=')[1]) : 1;
            return { code, q };
        })
        .sort((a, b) => b.q - a.q)
        .map(item => item.code);
}

/**
 * Find matching language from supported list
 */
function findMatchingLanguage(preferred: string[], supported: string[]): string | null {
    for (const lang of preferred) {
        // Exact match
        const exact = supported.find(s => s.toLowerCase() === lang.toLowerCase());
        if (exact) return exact;

        // Prefix match (e.g., 'en' matches 'en-US')
        const prefix = lang.split('-')[0].toLowerCase();
        const prefixMatch = supported.find(s => s.toLowerCase().startsWith(prefix));
        if (prefixMatch) return prefixMatch;
    }
    return null;
}

/**
 * Simple cookie parser
 */
function parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach(cookie => {
        const [name, ...rest] = cookie.split('=');
        if (name && rest.length) {
            cookies[name.trim()] = rest.join('=').trim();
        }
    });
    return cookies;
}

export default languageMiddleware;
