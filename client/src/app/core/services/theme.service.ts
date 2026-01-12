import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'cms-admin-theme';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    /** 用戶選擇的主題模式 */
    readonly theme = signal<ThemeMode>('system');

    /** 實際生效的主題（解析 system 後的結果） */
    readonly effectiveTheme = computed(() => this.resolveEffectiveTheme());

    /** 系統偏好的主題 */
    private systemPrefersDark = signal(false);

    /** MediaQueryList 用於監聽系統主題變化 */
    private mediaQuery: MediaQueryList | null = null;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document
    ) { }

    /**
     * 初始化主題服務
     * 應在 App 啟動時調用
     */
    initTheme(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        // 1. 檢測系統偏好
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.systemPrefersDark.set(this.mediaQuery.matches);

        // 監聽系統主題變化
        this.mediaQuery.addEventListener('change', (e) => {
            this.systemPrefersDark.set(e.matches);
            this.applyTheme();
        });

        // 2. 從 localStorage 讀取用戶偏好
        const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
            this.theme.set(stored);
        }

        // 3. 應用主題
        this.applyTheme();
    }

    /**
     * 設置主題
     */
    setTheme(mode: ThemeMode): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.theme.set(mode);
        localStorage.setItem(THEME_STORAGE_KEY, mode);
        this.applyTheme();
    }

    /**
     * 循環切換主題：light → dark → system → light
     */
    toggleTheme(): void {
        const current = this.theme();
        const next: ThemeMode = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
        this.setTheme(next);
    }

    /**
     * 快速切換：僅在 light 和 dark 之間切換
     */
    toggleLightDark(): void {
        const effective = this.effectiveTheme();
        this.setTheme(effective === 'dark' ? 'light' : 'dark');
    }

    /**
     * 解析實際生效的主題
     */
    private resolveEffectiveTheme(): 'light' | 'dark' {
        const mode = this.theme();
        if (mode === 'system') {
            return this.systemPrefersDark() ? 'dark' : 'light';
        }
        return mode;
    }

    /**
     * 將主題應用到 DOM
     */
    private applyTheme(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const effective = this.resolveEffectiveTheme();
        const html = this.document.documentElement;

        if (effective === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }

        // 更新 meta theme-color 以配合系統 UI
        this.updateMetaThemeColor(effective);
    }

    /**
     * 更新 meta theme-color 標籤
     */
    private updateMetaThemeColor(theme: 'light' | 'dark'): void {
        let meta = this.document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = this.document.createElement('meta');
            meta.setAttribute('name', 'theme-color');
            this.document.head.appendChild(meta);
        }
        // Dark: slate-900, Light: white
        meta.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
    }
}
