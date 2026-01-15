import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockManifest } from '../block.types';

@Component({
    selector: 'app-text-block',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div [id]="id()" [innerHTML]="content()"></div>
  `
})
export class TextBlockComponent {
    readonly content = input<string>('');
    readonly id = input<string>('');

    static manifest: ContentBlockManifest = {
        type: 'text-block',
        displayName: 'Rich Text',
        category: 'Content',
        thumbnail: 'assets/icons/blocks/text.svg',
        description: 'A simple rich text block with styling controls.',
        schema: {
            properties: {
                content: {
                    type: 'string',
                    title: 'Content',
                    ui: { widget: 'rich-text' }
                }
            }
        },
        styleSchema: {
            properties: {
                typography: {
                    type: 'object',
                    title: 'Typography',
                    properties: {
                        fontSize: { type: 'string', title: 'Font Size' },
                        fontWeight: { type: 'string', title: 'Font Weight' },
                        textAlign: { type: 'string', title: 'Alignment', enum: ['left', 'center', 'right', 'justify'] },
                        color: { type: 'string', title: 'Text Color', ui: { widget: 'color' } }
                    }
                },
                spacing: {
                    type: 'object',
                    title: 'Spacing',
                    properties: {
                        padding: { type: 'string', title: 'Padding' },
                        margin: { type: 'string', title: 'Margin' }
                    }
                }
            }
        }
    };
}
