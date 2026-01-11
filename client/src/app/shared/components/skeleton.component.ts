import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skeleton Loader Component
 * Prevents CLS (Cumulative Layout Shift) during content loading
 */
@Component({
    selector: 'app-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="skeleton" [ngClass]="variant" [ngStyle]="customStyle">
            <ng-content></ng-content>
        </div>
    `,
    styles: [`
        .skeleton {
            background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
            border-radius: 4px;
        }

        @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        /* Variants */
        .skeleton.text {
            height: 1em;
            width: 100%;
        }

        .skeleton.text-short {
            height: 1em;
            width: 60%;
        }

        .skeleton.title {
            height: 1.5em;
            width: 80%;
            margin-bottom: 8px;
        }

        .skeleton.avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }

        .skeleton.button {
            height: 40px;
            width: 120px;
            border-radius: 6px;
        }

        .skeleton.card {
            height: 200px;
            width: 100%;
            border-radius: 8px;
        }

        .skeleton.image {
            aspect-ratio: 16/9;
            width: 100%;
            border-radius: 8px;
        }

        .skeleton.image-square {
            aspect-ratio: 1/1;
            width: 100%;
            border-radius: 8px;
        }

        .skeleton.paragraph {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .skeleton.paragraph::before,
        .skeleton.paragraph::after {
            content: '';
            display: block;
            height: 1em;
            background: inherit;
            border-radius: 4px;
        }

        .skeleton.paragraph::before {
            width: 100%;
        }

        .skeleton.paragraph::after {
            width: 75%;
        }
    `]
})
export class SkeletonComponent {
    @Input() variant: 'text' | 'text-short' | 'title' | 'avatar' | 'button' | 'card' | 'image' | 'image-square' | 'paragraph' = 'text';
    @Input() width?: string;
    @Input() height?: string;

    get customStyle(): Record<string, string> {
        const style: Record<string, string> = {};
        if (this.width) style['width'] = this.width;
        if (this.height) style['height'] = this.height;
        return style;
    }
}

/**
 * Content Block Skeleton Component
 * Shows skeleton for different content block types
 */
@Component({
    selector: 'app-content-skeleton',
    standalone: true,
    imports: [CommonModule, SkeletonComponent],
    template: `
        <div class="content-skeleton" [ngSwitch]="type">
            <!-- Hero Skeleton -->
            <div *ngSwitchCase="'hero-carousel'" class="hero-skeleton">
                <app-skeleton variant="image" height="400px"></app-skeleton>
                <div class="hero-content">
                    <app-skeleton variant="title" width="60%"></app-skeleton>
                    <app-skeleton variant="text" width="80%"></app-skeleton>
                    <app-skeleton variant="button"></app-skeleton>
                </div>
            </div>

            <!-- Feature Grid Skeleton -->
            <div *ngSwitchCase="'feature-grid'" class="feature-grid-skeleton">
                <app-skeleton variant="title" width="40%"></app-skeleton>
                <div class="grid">
                    <div class="feature-item" *ngFor="let i of [1,2,3]">
                        <app-skeleton variant="avatar"></app-skeleton>
                        <app-skeleton variant="title" width="70%"></app-skeleton>
                        <app-skeleton variant="paragraph"></app-skeleton>
                    </div>
                </div>
            </div>

            <!-- Card Carousel Skeleton -->
            <div *ngSwitchCase="'card-carousel'" class="card-carousel-skeleton">
                <app-skeleton variant="title" width="40%"></app-skeleton>
                <div class="cards">
                    <div class="card" *ngFor="let i of [1,2,3]">
                        <app-skeleton variant="image"></app-skeleton>
                        <app-skeleton variant="title" width="80%"></app-skeleton>
                        <app-skeleton variant="text"></app-skeleton>
                    </div>
                </div>
            </div>

            <!-- Stats Counter Skeleton -->
            <div *ngSwitchCase="'stats-counter'" class="stats-skeleton">
                <div class="stat" *ngFor="let i of [1,2,3,4]">
                    <app-skeleton variant="title" width="60px"></app-skeleton>
                    <app-skeleton variant="text-short"></app-skeleton>
                </div>
            </div>

            <!-- Default Skeleton -->
            <div *ngSwitchDefault class="default-skeleton">
                <app-skeleton variant="card"></app-skeleton>
            </div>
        </div>
    `,
    styles: [`
        .content-skeleton {
            padding: 24px 0;
        }

        .hero-skeleton {
            position: relative;
        }

        .hero-content {
            position: absolute;
            bottom: 24px;
            left: 24px;
            right: 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .feature-grid-skeleton .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-top: 24px;
        }

        .feature-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            text-align: center;
        }

        .card-carousel-skeleton .cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-top: 24px;
        }

        .card {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .stats-skeleton {
            display: flex;
            justify-content: space-around;
            padding: 32px;
            background: #f1f5f9;
            border-radius: 8px;
        }

        .stat {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }

        @media (max-width: 768px) {
            .feature-grid-skeleton .grid,
            .card-carousel-skeleton .cards {
                grid-template-columns: 1fr;
            }

            .stats-skeleton {
                flex-wrap: wrap;
                gap: 16px;
            }

            .stat {
                width: 45%;
            }
        }
    `]
})
export class ContentSkeletonComponent {
    @Input() type: string = 'default';
}
