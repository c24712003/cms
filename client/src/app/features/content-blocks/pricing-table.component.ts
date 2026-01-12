import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentBlockManifest } from './block.types';

interface PlanFeature {
    text: string;
    included: boolean;
}

interface PricingPlan {
    name: string;
    price: string;
    period: string;
    description?: string;
    features: PlanFeature[];
    cta: { text: string; link: string };
    highlighted?: boolean;
}

@Component({
    selector: 'app-pricing-table',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <section class="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Header -->
        <div class="text-center mb-16">
          <h2 *ngIf="title" class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {{ title }}
          </h2>
          <p *ngIf="subtitle" class="text-lg text-slate-600 max-w-2xl mx-auto">
            {{ subtitle }}
          </p>
        </div>
        
        <!-- Pricing Grid -->
        <div 
          class="grid gap-8"
          [class.md:grid-cols-2]="plans.length === 2"
          [class.md:grid-cols-3]="plans.length >= 3"
          [class.lg:grid-cols-3]="plans.length >= 3">
          
          <div 
            *ngFor="let plan of plans" 
            class="relative rounded-2xl p-8 transition-all duration-300"
            [class.bg-white]="!plan.highlighted"
            [class.border]="!plan.highlighted"
            [class.border-slate-200]="!plan.highlighted"
            [class.hover:border-blue-200]="!plan.highlighted"
            [class.hover:shadow-xl]="!plan.highlighted"
            [class.bg-gradient-to-br]="plan.highlighted"
            [class.from-blue-600]="plan.highlighted"
            [class.to-indigo-700]="plan.highlighted"
            [class.shadow-2xl]="plan.highlighted"
            [class.shadow-blue-500/25]="plan.highlighted"
            [class.scale-105]="plan.highlighted"
            [class.z-10]="plan.highlighted">
            
            <!-- Popular Badge -->
            <div 
              *ngIf="plan.highlighted" 
              class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
              最人気
            </div>
            
            <!-- Plan Header -->
            <div class="text-center mb-8">
              <h3 
                class="text-xl font-bold mb-4"
                [class.text-slate-900]="!plan.highlighted"
                [class.text-white]="plan.highlighted">
                {{ plan.name }}
              </h3>
              
              <div class="flex items-baseline justify-center gap-1">
                <span 
                  class="text-sm font-medium"
                  [class.text-slate-500]="!plan.highlighted"
                  [class.text-blue-200]="plan.highlighted">
                  {{ currency }}
                </span>
                <span 
                  class="text-5xl font-bold tracking-tight"
                  [class.text-slate-900]="!plan.highlighted"
                  [class.text-white]="plan.highlighted">
                  {{ plan.price }}
                </span>
                <span 
                  class="text-sm"
                  [class.text-slate-500]="!plan.highlighted"
                  [class.text-blue-200]="plan.highlighted">
                  / {{ plan.period }}
                </span>
              </div>
              
              <p 
                *ngIf="plan.description" 
                class="mt-4 text-sm"
                [class.text-slate-600]="!plan.highlighted"
                [class.text-blue-100]="plan.highlighted">
                {{ plan.description }}
              </p>
            </div>
            
            <!-- Features List -->
            <ul class="space-y-4 mb-8">
              <li 
                *ngFor="let feature of plan.features" 
                class="flex items-start gap-3">
                <svg 
                  *ngIf="feature.included"
                  class="w-5 h-5 flex-shrink-0 mt-0.5"
                  [class.text-blue-600]="!plan.highlighted"
                  [class.text-blue-200]="plan.highlighted"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <svg 
                  *ngIf="!feature.included"
                  class="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-300"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                <span 
                  [class.text-slate-700]="!plan.highlighted && feature.included"
                  [class.text-slate-400]="!plan.highlighted && !feature.included"
                  [class.text-white]="plan.highlighted && feature.included"
                  [class.text-blue-200/60]="plan.highlighted && !feature.included"
                  [class.line-through]="!feature.included">
                  {{ feature.text }}
                </span>
              </li>
            </ul>
            
            <!-- CTA Button -->
            <a 
              *ngIf="plan.cta"
              [routerLink]="plan.cta.link"
              class="block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              [class.bg-blue-600]="!plan.highlighted"
              [class.hover:bg-blue-500]="!plan.highlighted"
              [class.text-white]="!plan.highlighted"
              [class.bg-white]="plan.highlighted"
              [class.hover:bg-blue-50]="plan.highlighted"
              [class.text-blue-600]="plan.highlighted">
              {{ plan.cta.text }}
            </a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class PricingTableComponent {
    static manifest: ContentBlockManifest = {
        type: 'pricing-table',
        displayName: 'Pricing Table',
        category: 'Content',
        description: 'Tiered pricing comparison cards',
        schema: {
            properties: {
                title: { type: 'string', title: 'Title' },
                subtitle: { type: 'string', title: 'Subtitle', ui: { widget: 'textarea' } },
                currency: { type: 'string', title: 'Currency Symbol', default: '¥' },
                plans: {
                    type: 'array',
                    title: 'Pricing Plans',
                    ui: { widget: 'array', addLabel: 'Add Plan' },
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', title: 'Plan Name' },
                            price: { type: 'string', title: 'Price' },
                            period: { type: 'string', title: 'Billing Period', default: '月' },
                            description: { type: 'string', title: 'Description' },
                            highlighted: { type: 'boolean', title: 'Featured Plan', ui: { widget: 'toggle' } },
                            features: {
                                type: 'array',
                                title: 'Features',
                                ui: { widget: 'array', addLabel: 'Add Feature' },
                                items: {
                                    type: 'object',
                                    properties: {
                                        text: { type: 'string', title: 'Feature Text' },
                                        included: { type: 'boolean', title: 'Included', default: true, ui: { widget: 'toggle' } }
                                    }
                                }
                            },
                            cta: {
                                type: 'object',
                                title: 'CTA Button',
                                properties: {
                                    text: { type: 'string', title: 'Button Text', default: '今すぐ始める' },
                                    link: { type: 'string', title: 'Button Link' }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() currency: string = '¥';
    @Input() plans: PricingPlan[] = [];
}
