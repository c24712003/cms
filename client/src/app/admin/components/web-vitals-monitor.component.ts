import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

/**
 * Web Vitals Metrics Interface
 */
export interface WebVitalsMetric {
    name: 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB' | 'INP';
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta: number;
    id: string;
}

interface WebVitalsData {
    lcp: number | null;
    fid: number | null;
    cls: number | null;
    fcp: number | null;
    ttfb: number | null;
    inp: number | null;
    timestamp: Date;
}

/**
 * Web Vitals Monitor Component
 * Displays Core Web Vitals metrics in real-time
 */
@Component({
    selector: 'app-web-vitals-monitor',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="vitals-panel">
            <div class="vitals-header">
                <h3><i class="fas fa-tachometer-alt"></i> Core Web Vitals</h3>
                <span class="status-badge" [class]="overallStatus">{{ overallLabel }}</span>
            </div>

            <div class="metrics-grid">
                <!-- LCP -->
                <div class="metric-card" [class]="getMetricClass('LCP')">
                    <div class="metric-icon">
                        <i class="fas fa-image"></i>
                    </div>
                    <div class="metric-info">
                        <span class="metric-name">LCP</span>
                        <span class="metric-label">Largest Contentful Paint</span>
                    </div>
                    <div class="metric-value">
                        {{ formatValue(vitals.lcp, 'ms') }}
                    </div>
                    <div class="metric-threshold">
                        目標: &lt; 2.5s
                    </div>
                </div>

                <!-- FID / INP -->
                <div class="metric-card" [class]="getMetricClass('INP')">
                    <div class="metric-icon">
                        <i class="fas fa-hand-pointer"></i>
                    </div>
                    <div class="metric-info">
                        <span class="metric-name">INP</span>
                        <span class="metric-label">Interaction to Next Paint</span>
                    </div>
                    <div class="metric-value">
                        {{ formatValue(vitals.inp, 'ms') }}
                    </div>
                    <div class="metric-threshold">
                        目標: &lt; 200ms
                    </div>
                </div>

                <!-- CLS -->
                <div class="metric-card" [class]="getMetricClass('CLS')">
                    <div class="metric-icon">
                        <i class="fas fa-arrows-alt"></i>
                    </div>
                    <div class="metric-info">
                        <span class="metric-name">CLS</span>
                        <span class="metric-label">Cumulative Layout Shift</span>
                    </div>
                    <div class="metric-value">
                        {{ formatValue(vitals.cls, '') }}
                    </div>
                    <div class="metric-threshold">
                        目標: &lt; 0.1
                    </div>
                </div>

                <!-- FCP -->
                <div class="metric-card" [class]="getMetricClass('FCP')">
                    <div class="metric-icon">
                        <i class="fas fa-paint-brush"></i>
                    </div>
                    <div class="metric-info">
                        <span class="metric-name">FCP</span>
                        <span class="metric-label">First Contentful Paint</span>
                    </div>
                    <div class="metric-value">
                        {{ formatValue(vitals.fcp, 'ms') }}
                    </div>
                    <div class="metric-threshold">
                        目標: &lt; 1.8s
                    </div>
                </div>

                <!-- TTFB -->
                <div class="metric-card" [class]="getMetricClass('TTFB')">
                    <div class="metric-icon">
                        <i class="fas fa-server"></i>
                    </div>
                    <div class="metric-info">
                        <span class="metric-name">TTFB</span>
                        <span class="metric-label">Time to First Byte</span>
                    </div>
                    <div class="metric-value">
                        {{ formatValue(vitals.ttfb, 'ms') }}
                    </div>
                    <div class="metric-threshold">
                        目標: &lt; 800ms
                    </div>
                </div>
            </div>

            <div class="vitals-footer">
                <span class="update-time">最後更新: {{ lastUpdate }}</span>
                <button (click)="refresh()" class="refresh-btn">
                    <i class="fas fa-sync-alt"></i> 刷新
                </button>
            </div>
        </div>
    `,
    styles: [`
        .vitals-panel {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .vitals-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .vitals-header h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
        }

        .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        .status-badge.good { background: #dcfce7; color: #16a34a; }
        .status-badge.needs-improvement { background: #fef3c7; color: #d97706; }
        .status-badge.poor { background: #fee2e2; color: #dc2626; }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 16px;
        }

        .metric-card {
            padding: 16px;
            border-radius: 8px;
            background: #f8fafc;
            border-left: 4px solid #94a3b8;
            transition: all 0.2s;
        }

        .metric-card.good { border-left-color: #22c55e; background: #f0fdf4; }
        .metric-card.needs-improvement { border-left-color: #f59e0b; background: #fffbeb; }
        .metric-card.poor { border-left-color: #ef4444; background: #fef2f2; }

        .metric-icon {
            font-size: 20px;
            color: #64748b;
            margin-bottom: 8px;
        }

        .metric-info {
            margin-bottom: 8px;
        }

        .metric-name {
            font-size: 14px;
            font-weight: 700;
            color: #1e293b;
            display: block;
        }

        .metric-label {
            font-size: 11px;
            color: #64748b;
        }

        .metric-value {
            font-size: 24px;
            font-weight: 700;
            color: #0f172a;
        }

        .metric-threshold {
            font-size: 11px;
            color: #94a3b8;
            margin-top: 4px;
        }

        .vitals-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
        }

        .update-time {
            font-size: 12px;
            color: #94a3b8;
        }

        .refresh-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .refresh-btn:hover {
            background: #2563eb;
        }
    `]
})
export class WebVitalsMonitorComponent implements OnInit, OnDestroy {
    vitals: WebVitalsData = {
        lcp: null,
        fid: null,
        cls: null,
        fcp: null,
        ttfb: null,
        inp: null,
        timestamp: new Date()
    };

    lastUpdate = '--:--:--';
    overallStatus = 'good';
    overallLabel = '良好';

    private isBrowser: boolean;

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private http: HttpClient
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngOnInit() {
        if (this.isBrowser) {
            this.initWebVitals();
        }
    }

    ngOnDestroy() {
        // Cleanup if needed
    }

    async initWebVitals() {
        try {
            // Dynamic import web-vitals library
            const webVitals = await import('web-vitals') as any;
            const { onCLS, onFCP, onLCP, onTTFB, onINP } = webVitals;

            onLCP((metric: any) => {
                this.vitals.lcp = metric.value;
                this.updateOverallStatus();
            });

            onINP((metric: any) => {
                this.vitals.inp = metric.value;
                this.updateOverallStatus();
            });

            onCLS((metric: any) => {
                this.vitals.cls = metric.value;
                this.updateOverallStatus();
            });

            onFCP((metric: any) => {
                this.vitals.fcp = metric.value;
                this.updateOverallStatus();
            });

            onTTFB((metric: any) => {
                this.vitals.ttfb = metric.value;
                this.updateOverallStatus();
            });

            this.updateTimestamp();
        } catch (e) {
            console.warn('Web Vitals library not available:', e);
        }
    }

    refresh() {
        // Force page reload to get fresh vitals
        if (this.isBrowser) {
            window.location.reload();
        }
    }

    updateTimestamp() {
        const now = new Date();
        this.lastUpdate = now.toLocaleTimeString('zh-TW');
        this.vitals.timestamp = now;
    }

    updateOverallStatus() {
        this.updateTimestamp();

        const ratings: string[] = [];

        if (this.vitals.lcp !== null) {
            ratings.push(this.vitals.lcp <= 2500 ? 'good' : this.vitals.lcp <= 4000 ? 'needs-improvement' : 'poor');
        }
        if (this.vitals.inp !== null) {
            ratings.push(this.vitals.inp <= 200 ? 'good' : this.vitals.inp <= 500 ? 'needs-improvement' : 'poor');
        }
        if (this.vitals.cls !== null) {
            ratings.push(this.vitals.cls <= 0.1 ? 'good' : this.vitals.cls <= 0.25 ? 'needs-improvement' : 'poor');
        }

        if (ratings.includes('poor')) {
            this.overallStatus = 'poor';
            this.overallLabel = '需改善';
        } else if (ratings.includes('needs-improvement')) {
            this.overallStatus = 'needs-improvement';
            this.overallLabel = '尚可';
        } else {
            this.overallStatus = 'good';
            this.overallLabel = '良好';
        }
    }

    getMetricClass(metric: string): string {
        const value = this.getMetricValue(metric);
        if (value === null) return '';

        switch (metric) {
            case 'LCP':
                return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
            case 'INP':
            case 'FID':
                return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
            case 'CLS':
                return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
            case 'FCP':
                return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
            case 'TTFB':
                return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
            default:
                return '';
        }
    }

    getMetricValue(metric: string): number | null {
        switch (metric) {
            case 'LCP': return this.vitals.lcp;
            case 'INP': return this.vitals.inp;
            case 'FID': return this.vitals.fid;
            case 'CLS': return this.vitals.cls;
            case 'FCP': return this.vitals.fcp;
            case 'TTFB': return this.vitals.ttfb;
            default: return null;
        }
    }

    formatValue(value: number | null, unit: string): string {
        if (value === null) return '--';

        if (unit === 'ms') {
            if (value >= 1000) {
                return (value / 1000).toFixed(2) + 's';
            }
            return Math.round(value) + 'ms';
        }

        // CLS has no unit
        return value.toFixed(3);
    }
}
