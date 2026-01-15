import {
    Component,
    ElementRef,
    ViewChild,
    AfterViewInit,
    OnDestroy,
    input,
    output,
    effect,
    signal,
    inject,
    PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// CodeMirror imports
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { css, cssCompletionSource } from '@codemirror/lang-css';
import { autocompletion } from '@codemirror/autocomplete';
import { oneDark } from '@codemirror/theme-one-dark';

/**
 * CSS Editor Component using CodeMirror 6
 * Provides syntax highlighting, autocomplete, and bracket matching for CSS editing.
 */
@Component({
    selector: 'app-css-editor',
    standalone: true,
    template: `
        <div 
            #editorContainer 
            class="css-editor-container rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600"
            [style.minHeight.px]="minHeight()">
        </div>
    `,
    styles: [`
        :host {
            display: block;
        }
        .css-editor-container {
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
            background-color: #2b313f;
        }
        /* CodeMirror customizations */
        .css-editor-container :global(.cm-editor) {
            height: 100%;
            font-size: 13px;
        }
        .css-editor-container :global(.cm-scroller) {
            overflow: auto;
        }
        .css-editor-container :global(.cm-content) {
            padding: 8px 0;
        }
        .css-editor-container :global(.cm-gutters) {
            background: transparent;
            border: none;
        }
    `]
})
export class CssEditorComponent implements AfterViewInit, OnDestroy {
    @ViewChild('editorContainer') editorContainer!: ElementRef<HTMLDivElement>;

    // Inputs
    readonly value = input<string>('');
    readonly placeholder = input<string>('');
    readonly minHeight = input<number>(120);
    readonly darkMode = input<boolean>(false);

    // Outputs
    readonly valueChange = output<string>();

    // Internal state
    private editorView: EditorView | null = null;
    private themeCompartment = new Compartment();
    private platformId = inject(PLATFORM_ID);
    private isUpdatingFromInput = false;

    constructor() {
        // Effect: Update editor content when input value changes
        effect(() => {
            const newValue = this.value();
            if (this.editorView && !this.isUpdatingFromInput) {
                const currentValue = this.editorView.state.doc.toString();
                if (newValue !== currentValue) {
                    this.editorView.dispatch({
                        changes: {
                            from: 0,
                            to: this.editorView.state.doc.length,
                            insert: newValue
                        }
                    });
                }
            }
        });

        // Effect: Update theme when darkMode changes
        effect(() => {
            const isDark = this.darkMode();
            if (this.editorView) {
                this.editorView.dispatch({
                    effects: this.themeCompartment.reconfigure(isDark ? oneDark : [])
                });
            }
        });
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.initializeEditor();
    }

    ngOnDestroy(): void {
        if (this.editorView) {
            this.editorView.destroy();
            this.editorView = null;
        }
    }

    private initializeEditor(): void {
        const updateListener = EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                this.isUpdatingFromInput = true;
                const newValue = update.state.doc.toString();
                this.valueChange.emit(newValue);
                // Use setTimeout to reset flag after Angular's change detection
                setTimeout(() => {
                    this.isUpdatingFromInput = false;
                }, 0);
            }
        });

        const isDarkMode = this.checkDarkMode();

        const state = EditorState.create({
            doc: this.value(),
            extensions: [
                // Line numbers and active line highlighting
                lineNumbers(),
                highlightActiveLineGutter(),
                highlightActiveLine(),

                // Bracket matching
                bracketMatching(),

                // Syntax highlighting
                syntaxHighlighting(defaultHighlightStyle, { fallback: true }),

                // CSS language support with autocomplete
                css(),
                autocompletion({
                    override: [cssCompletionSource]
                }),

                // Keymaps
                keymap.of([
                    ...defaultKeymap,
                    indentWithTab
                ]),

                // Theme (dynamic)
                this.themeCompartment.of(isDarkMode ? oneDark : []),

                // Update listener
                updateListener,

                // Basic styling
                EditorView.theme({
                    '&': {
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff'
                    },
                    '.cm-content': {
                        caretColor: isDarkMode ? '#60a5fa' : '#2563eb'
                    },
                    '.cm-cursor': {
                        borderLeftColor: isDarkMode ? '#60a5fa' : '#2563eb'
                    },
                    '&.cm-focused .cm-selectionBackground, ::selection': {
                        backgroundColor: isDarkMode ? '#334155' : '#dbeafe'
                    }
                })
            ]
        });

        this.editorView = new EditorView({
            state,
            parent: this.editorContainer.nativeElement
        });
    }

    /**
     * Check if the page is in dark mode
     */
    private checkDarkMode(): boolean {
        if (!isPlatformBrowser(this.platformId)) return false;

        // Check for dark class on html element or use input
        return this.darkMode() ||
            document.documentElement.classList.contains('dark') ||
            window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /**
     * Focus the editor
     */
    focus(): void {
        this.editorView?.focus();
    }
}
