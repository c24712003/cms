import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockManifest } from '../block.types';

@Component({
    selector: 'app-parallax-hero',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div [id]="id()" class="relative overflow-hidden flex items-center justify-center isolate" [class]="customClass()">
        <!-- Background Layer -->
        <div class="absolute inset-0 z-0 select-none pointer-events-none">
             <img *ngIf="bgImage()" [src]="bgImage()" class="w-full h-full object-cover" alt="Hero Background">
             <div class="absolute inset-0" [style.background-color]="overlayColor()" [style.opacity]="overlayOpacity()"></div>
        </div>

        <!-- Content Layer -->
        <div class="relative z-10 container mx-auto px-6 text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6 text-white" [innerHTML]="title()"></h1>
            <p class="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90" [innerHTML]="subtitle()"></p>
            
            <div class="flex gap-4 justify-center" *ngIf="showButtons()">
                <button class="btn btn-primary btn-lg">{{ primaryBtnText() }}</button>
                <button class="btn btn-outline text-white btn-lg hover:bg-white/10" *ngIf="showSecondaryBtn()">{{ secondaryBtnText() }}</button>
            </div>
        </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class ParallaxHeroComponent {
    readonly id = input<string>('');
    readonly customClass = input<string>('');

    // Data Inputs mapped from block.data
    readonly title = input<string>('Welcome to the Future');
    readonly subtitle = input<string>('Build amazing experiences with our new block system.');
    readonly bgImage = input<string>('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop');
    readonly overlayColor = input<string>('#000000');
    readonly overlayOpacity = input<number>(0.5);
    readonly showButtons = input<boolean>(true);
    readonly primaryBtnText = input<string>('Get Started');
    readonly showSecondaryBtn = input<boolean>(true);
    readonly secondaryBtnText = input<string>('Learn More');

    static manifest: ContentBlockManifest = {
        type: 'parallax-hero',
        displayName: 'Parallax Hero',
        category: 'Hero',
        thumbnail: 'assets/icons/blocks/hero.svg',
        description: 'A full-screen hero section with background image and centering.',
        schema: {
            properties: {
                title: { type: 'string', title: 'Title', ui: { widget: 'text' }, default: 'Heading' },
                subtitle: { type: 'string', title: 'Subtitle', ui: { widget: 'textarea' }, default: 'Subheading text goes here.' },
                bgImage: { type: 'string', title: 'Background Image', ui: { widget: 'image' } },
                overlayColor: { type: 'string', title: 'Overlay Color', ui: { widget: 'color' }, default: '#000000' },
                overlayOpacity: { type: 'number', title: 'Overlay Opacity', ui: { widget: 'range' }, default: 0.5 },
                showButtons: { type: 'boolean', title: 'Show Buttons', default: true },
                primaryBtnText: { type: 'string', title: 'Primary Button', default: 'Get Started' },
                showSecondaryBtn: { type: 'boolean', title: 'Show Secondary Button', default: true },
                secondaryBtnText: { type: 'string', title: 'Secondary Button', default: 'Learn More' }
            }
        },
        styleSchema: {
            properties: {
                size: {
                    type: 'object',
                    title: 'Dimensions',
                    properties: {
                        height: { type: 'string', title: 'Height (e.g. 100vh, 600px)', default: '80vh' }
                    }
                },
                typography: {
                    type: 'object',
                    title: 'Typography',
                    properties: {
                        textAlign: { type: 'string', title: 'Text Alignment', enum: ['left', 'center', 'right'], default: 'center' }
                    }
                },
                spacing: {
                    type: 'object',
                    title: 'Spacing',
                    properties: {
                        padding: { type: 'string', title: 'Padding (Top/Bottom)', default: '80px 0' }
                    }
                }
            }
        }
    };
}
