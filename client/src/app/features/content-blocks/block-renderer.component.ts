import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import all block components
import { HeroCarouselComponent } from './hero-carousel.component';
import { FeatureGridComponent } from './feature-grid.component';
import { CardCarouselComponent } from './card-carousel.component';
import { StatsCounterComponent } from './stats-counter.component';
import { CtaBannerComponent } from './cta-banner.component';
import { CaseStudyShowcaseComponent } from './case-study-showcase.component';
import { PageHeroComponent } from './page-hero.component';
import { FaqAccordionComponent } from './faq-accordion.component';
import { TimelineStepsComponent } from './timeline-steps.component';
import { ContactFormCtaComponent } from './contact-form-cta.component';
import { ContentWithImageComponent } from './content-with-image.component';

@Component({
  selector: 'app-block-renderer',
  standalone: true,
  imports: [
    CommonModule,
    HeroCarouselComponent,
    FeatureGridComponent,
    CardCarouselComponent,
    StatsCounterComponent,
    CtaBannerComponent,
    CaseStudyShowcaseComponent,
    PageHeroComponent,
    FaqAccordionComponent,
    TimelineStepsComponent,
    ContactFormCtaComponent,
    ContentWithImageComponent
  ],
  template: `
    <ng-container [ngSwitch]="block?.type">
      <!-- Hero Carousel -->
      <app-hero-carousel 
        *ngSwitchCase="'hero-carousel'" 
        [slides]="block.slides || []">
      </app-hero-carousel>
      
      <!-- Feature Grid -->
      <app-feature-grid 
        *ngSwitchCase="'feature-grid'" 
        [title]="block.title" 
        [items]="block.items || []">
      </app-feature-grid>
      
      <!-- Card Carousel -->
      <app-card-carousel 
        *ngSwitchCase="'card-carousel'" 
        [title]="block.title" 
        [subtitle]="block.subtitle"
        [cards]="block.cards || []">
      </app-card-carousel>
      
      <!-- Stats Counter -->
      <app-stats-counter 
        *ngSwitchCase="'stats-counter'" 
        [stats]="block.stats || []"
        [background]="block.background">
      </app-stats-counter>
      
      <!-- CTA Banner -->
      <app-cta-banner 
        *ngSwitchCase="'cta-banner'" 
        [title]="block.title"
        [description]="block.description"
        [primaryCta]="block.primaryCta"
        [secondaryCta]="block.secondaryCta">
      </app-cta-banner>
      
      <!-- Case Study Showcase -->
      <app-case-study-showcase 
        *ngSwitchCase="'case-study-showcase'" 
        [title]="block.title"
        [cases]="block.cases || []"
        [viewMoreText]="block.viewMoreText"
        [viewMoreLink]="block.viewMoreLink">
      </app-case-study-showcase>
      
      <!-- Page Hero -->
      <app-page-hero 
        *ngSwitchCase="'page-hero'" 
        [title]="block.title"
        [subtitle]="block.subtitle"
        [breadcrumb]="block.breadcrumb || []"
        [image]="block.image">
      </app-page-hero>
      
      <!-- FAQ Accordion -->
      <app-faq-accordion 
        *ngSwitchCase="'faq-accordion'" 
        [title]="block.title"
        [items]="block.items || []">
      </app-faq-accordion>
      
      <!-- Timeline Steps -->
      <app-timeline-steps 
        *ngSwitchCase="'timeline-steps'" 
        [title]="block.title"
        [subtitle]="block.subtitle"
        [steps]="block.steps || []">
      </app-timeline-steps>
      
      <!-- Contact Form CTA -->
      <app-contact-form-cta 
        *ngSwitchCase="'contact-form-cta'" 
        [title]="block.title"
        [description]="block.description"
        [fields]="block.fields"
        [submitButton]="block.submitButton"
        [privacy]="block.privacy"
        [contactInfo]="block.contactInfo">
      </app-contact-form-cta>

      <!-- Content With Image -->
      <app-content-with-image 
        *ngSwitchCase="'content-with-image'" 
        [title]="block.title"
        [items]="block.items || []"
        [image]="block.image"
        [imagePosition]="block.imagePosition || 'right'">
      </app-content-with-image>
      
      <!-- Fallback: Basic text/html blocks -->
      <div *ngSwitchCase="'text'" class="max-w-4xl mx-auto px-6 py-4">
        <p class="text-slate-600 leading-relaxed text-lg">{{ block.content }}</p>
      </div>
      
      <div *ngSwitchCase="'html'" class="max-w-4xl mx-auto px-6 py-4">
        <div [innerHTML]="block.content" class="prose prose-lg prose-slate"></div>
      </div>
      
      <!-- Unknown block type -->
      <div *ngSwitchDefault class="max-w-4xl mx-auto px-6 py-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p class="text-yellow-800 text-sm">Unknown block type: {{ block?.type }}</p>
      </div>
    </ng-container>
  `
})
export class BlockRendererComponent {
  @Input() block: any;
}

