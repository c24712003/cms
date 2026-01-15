import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoValidatorService, SeoValidationSummary, SeoValidationResult } from '../services/seo-validator.service';

/**
 * SEO Score Panel Component
 * Displays SEO validation results with visual indicators
 */
@Component({
    selector: 'app-seo-panel',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="seo-panel">
            <!-- Score Header -->
            <div class="seo-header">
                <div class="seo-score" [style.borderColor]="scoreColor">
                    <span class="score-value">{{ summary?.score || 0 }}</span>
                    <span class="score-label">SEO 分數</span>
                </div>
                <div class="seo-status">
                    <span class="status-badge" [style.backgroundColor]="scoreColor">
                        {{ scoreLabel }}
                    </span>
                    <p class="status-text">
                        {{ summary?.errors?.length || 0 }} 錯誤 · 
                        {{ summary?.warnings?.length || 0 }} 警告
                    </p>
                </div>
            </div>

            <!-- Validation Results -->
            <div class="seo-results" *ngIf="summary">
                <!-- Errors -->
                <div class="result-section" *ngIf="summary.errors.length > 0">
                    <h4 class="section-title error">
                        <i class="fas fa-times-circle"></i> 需要修正
                    </h4>
                    <ul class="result-list">
                        <li *ngFor="let error of summary.errors" class="result-item error">
                            <span class="field-name">{{ getFieldLabel(error.field) }}</span>
                            <span class="result-message">{{ error.message }}</span>
                            <span class="char-count" *ngIf="error.currentLength !== undefined">
                                {{ error.currentLength }}/{{ error.recommendedLength?.max }}
                            </span>
                        </li>
                    </ul>
                </div>

                <!-- Warnings -->
                <div class="result-section" *ngIf="summary.warnings.length > 0">
                    <h4 class="section-title warning">
                        <i class="fas fa-exclamation-triangle"></i> 建議改善
                    </h4>
                    <ul class="result-list">
                        <li *ngFor="let warning of summary.warnings" class="result-item warning">
                            <span class="field-name">{{ getFieldLabel(warning.field) }}</span>
                            <span class="result-message">{{ warning.message }}</span>
                            <span class="char-count" *ngIf="warning.currentLength !== undefined">
                                {{ warning.currentLength }}/{{ warning.recommendedLength?.max }}
                            </span>
                        </li>
                    </ul>
                </div>

                <!-- Info (Passed) -->
                <div class="result-section" *ngIf="summary.info.length > 0">
                    <h4 class="section-title info">
                        <i class="fas fa-check-circle"></i> 通過檢查
                    </h4>
                    <ul class="result-list collapsed">
                        <li *ngFor="let info of summary.info" class="result-item info">
                            <span class="field-name">{{ getFieldLabel(info.field) }}</span>
                            <span class="result-message">{{ info.message }}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Tips -->
            <div class="seo-tips">
                <h4><i class="fas fa-lightbulb"></i> SEO 小提示</h4>
                <ul>
                    <li>標題應包含主要關鍵字，並放在前半段</li>
                    <li>描述應具體說明頁面內容，並包含行動呼籲</li>
                    <li>每張圖片都需要描述性的 Alt 文字</li>
                </ul>
            </div>
        </div>
    `,
    styles: [`
        .seo-panel {
            background: var(--bg-secondary, #f8fafc);
            border-radius: 8px;
            padding: 16px;
            font-size: 14px;
        }

        .seo-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border-color, #e2e8f0);
        }

        .seo-score {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            border: 4px solid;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: white;
        }

        .score-value {
            font-size: 20px;
            font-weight: 700;
            line-height: 1;
        }

        .score-label {
            font-size: 10px;
            color: var(--text-muted, #64748b);
        }

        .seo-status {
            flex: 1;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            color: white;
            font-size: 12px;
            font-weight: 600;
        }

        .status-text {
            margin: 4px 0 0;
            color: var(--text-muted, #64748b);
            font-size: 13px;
        }

        .result-section {
            margin-bottom: 12px;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0 0 8px;
            font-size: 13px;
            font-weight: 600;
        }

        .section-title.error { color: #ef4444; }
        .section-title.warning { color: #f59e0b; }
        .section-title.info { color: #22c55e; }

        .result-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .result-list.collapsed {
            max-height: 80px;
            overflow: hidden;
        }

        .result-item {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 8px;
            margin-bottom: 4px;
            border-radius: 4px;
            background: white;
            border-left: 3px solid;
        }

        .result-item.error { border-left-color: #ef4444; }
        .result-item.warning { border-left-color: #f59e0b; }
        .result-item.info { border-left-color: #22c55e; }

        .field-name {
            font-weight: 600;
            min-width: 80px;
        }

        .result-message {
            flex: 1;
            color: var(--text-secondary, #475569);
        }

        .char-count {
            font-family: monospace;
            font-size: 12px;
            color: var(--text-muted, #64748b);
        }

        .seo-tips {
            margin-top: 16px;
            padding: 12px;
            background: #fffbeb;
            border-radius: 6px;
            border: 1px solid #fcd34d;
        }

        .seo-tips h4 {
            margin: 0 0 8px;
            font-size: 13px;
            color: #92400e;
        }

        .seo-tips ul {
            margin: 0;
            padding-left: 20px;
            font-size: 12px;
            color: #78716c;
        }

        .seo-tips li {
            margin-bottom: 4px;
        }
    `]
})
export class SeoPanelComponent implements OnChanges {
    readonly title = input<string>('');
    readonly description = input<string>('');
    readonly content = input<any[]>([]);
    readonly language = input<string>('en');

    summary: SeoValidationSummary | null = null;
    scoreColor: string = '#64748b';
    scoreLabel: string = '—';

    constructor(private seoValidator: SeoValidatorService) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.validate();
    }

    validate(): void {
        this.summary = this.seoValidator.validatePage({
            title: this.title(),
            description: this.description(),
            content: this.content(),
            language: this.language()
        });

        this.scoreColor = this.seoValidator.getScoreColor(this.summary.score);
        this.scoreLabel = this.seoValidator.getScoreLabel(this.summary.score);
    }

    getFieldLabel(field: string): string {
        const labels: Record<string, string> = {
            'title': '標題',
            'description': '描述',
            'alt': 'Alt 文字',
            'h1': 'H1 標籤'
        };

        if (field.includes('.image')) {
            return '圖片';
        }

        return labels[field] || field;
    }
}
