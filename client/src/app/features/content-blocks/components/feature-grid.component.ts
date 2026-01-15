import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockManifest } from '../block.types';

interface FeatureItem {
    icon: string;
    title: string;
    description: string;
    link?: string;
}

@Component({
    selector: 'app-feature-grid',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div [id]="id()" class="py-12 px-6" [class]="customClass()"
         [attr.data-block-id]="blockId()"
         [style.background-color]="styles()?.background?.color">
        <div class="container mx-auto">
            <!-- Header -->
            <div class="text-center mb-12" *ngIf="headline || subheadline">
                <h2 class="text-3xl font-bold mb-4" *ngIf="headline()">{{ headline() }}</h2>
                <p class="text-slate-600 max-w-2xl mx-auto" *ngIf="subheadline()">{{ subheadline() }}</p>
            </div>

            <!-- Grid -->
            <div class="grid gap-8" 
                 [style.grid-template-columns]="getGridColumns()"
                 [style.gap]="gap()">
                
                <div *ngFor="let item of features()" class="feature-card p-6 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <!-- Icon -->
                    <div class="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 text-2xl" 
                         *ngIf="item.icon">
                        <i [class]="item.icon"></i> 
                        <!-- Simple image fallback if no font icon system is present, or assume emojis for prototype -->
                        <span *ngIf="!item.icon.includes('fa-')">{{ item.icon }}</span>
                    </div>

                    <h3 class="text-xl font-bold mb-2 text-slate-800">{{ item.title }}</h3>
                    <p class="text-slate-600 leading-relaxed">{{ item.description }}</p>
                    
                    <a *ngIf="item.link" [href]="item.link" class="inline-block mt-4 text-primary font-medium hover:underline">
                        Learn more &rarr;
                    </a>
                </div>

            </div>
        </div>
    </div>
  `
})
export class FeatureGridComponent {
    readonly id = input<string>('');
    readonly blockId = input<string>('');
    readonly customClass = input<string>('');
    readonly styles = input<any>({});

    readonly headline = input<string>('Our Features');
    readonly subheadline = input<string>('Discover what makes our platform unique.');
    readonly features = input<FeatureItem[]>([
        { icon: '🚀', title: 'Fast Performance', description: 'Optimized for speed and efficiency.' },
        { icon: '🛡️', title: 'Secure by Default', description: 'Enterprise-grade security built-in.' },
        { icon: '🎨', title: 'Customizable', description: 'Adapt text, colors, and layout easily.' }
    ]);
    readonly columns = input<number>(3);
    readonly gap = input<string>('2rem');

    getGridColumns(): string {
        // Basic responsive grid mapping can be handled here or via style schema
        // Since StyleService handles @media, we might rely on that, but for grid-template-columns specific logic:
        return `repeat(auto-fit, minmax(250px, 1fr))`;
        // Ideally we bind 'columns' input to a style variable or use a class map logic based on screen size
        // For now, auto-fit is robust.
    }

    static manifest: ContentBlockManifest = {
        type: 'feature-grid',
        displayName: 'Feature Grid',
        category: 'Content',
        thumbnail: 'assets/icons/blocks/grid.svg',
        description: 'A grid of feature cards with icons and text.',
        schema: {
            properties: {
                headline: { type: 'string', title: 'Headline', default: 'Our Features' },
                subheadline: { type: 'string', title: 'Subheadline', ui: { widget: 'textarea' } },
                features: {
                    type: 'array',
                    title: 'Features',
                    ui: {
                        widget: 'array',
                        addLabel: 'Add Feature'
                    },
                    items: {
                        type: 'object',
                        title: 'Feature Item',
                        properties: {
                            icon: { type: 'string', title: 'Icon (Emoji or Class)', default: '★' },
                            title: { type: 'string', title: 'Title', default: 'Feature Title' },
                            description: { type: 'string', title: 'Description', ui: { widget: 'textarea' }, default: 'Feature description goes here.' },
                            link: { type: 'string', title: 'Link URL' }
                        }
                    }
                },
                columns: { type: 'number', title: 'Columns (Desktop)', default: 3, enum: [2, 3, 4] },
                gap: { type: 'string', title: 'Grid Gap', default: '2rem' }
            }
        },
        styleSchema: {
            properties: {
                background: {
                    type: 'object',
                    title: 'Background',
                    properties: {
                        color: { type: 'string', title: 'Background Color', ui: { widget: 'color' } }
                    }
                },
                typography: {
                    type: 'object',
                    title: 'Typography',
                    properties: {
                        textAlign: { type: 'string', title: 'Alignment', enum: ['left', 'center'] }
                    }
                },
                spacing: {
                    type: 'object',
                    title: 'Spacing',
                    properties: {
                        padding: { type: 'string', title: 'Section Padding', default: '4rem 1rem' }
                    }
                }
            }
        }
    };
}
