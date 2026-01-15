import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

// Import services and new renderer
import { BlockRegistryService } from './block-registry.service';
import { DynamicBlockRendererComponent } from './dynamic-block-renderer.component';
import { StyleValidatorService } from './style-validator.service';
import { StyleInjectorService } from './style-injector.service';

// Import all block components
import { HeroCarouselComponent } from './hero-carousel.component';
import { FeatureGridComponent } from './components/feature-grid.component';
import { CardCarouselComponent } from './card-carousel.component';
import { StatsCounterComponent } from './components/stats-counter.component';
import { CtaBannerComponent } from './cta-banner.component';
import { CaseStudyShowcaseComponent } from './case-study-showcase.component';
import { PageHeroComponent } from './page-hero.component';
import { FaqAccordionComponent } from './components/faq-accordion.component';
import { TimelineStepsComponent } from './timeline-steps.component';
import { ContactFormCtaComponent } from './contact-form-cta.component';
import { ContentWithImageComponent } from './content-with-image.component';

// New Block Components
import { VideoHeroComponent } from './video-hero.component';
import { SplitHeroComponent } from './split-hero.component';
import { MasonryGalleryComponent } from './masonry-gallery.component';
import { ImageComparisonComponent } from './image-comparison.component';
import { PricingTableComponent } from './pricing-table.component';
import { TestimonialSliderComponent } from './testimonial-slider.component';
import { TeamGridComponent } from './team-grid.component';

@Component({
  selector: 'app-block-renderer',
  standalone: true,
  imports: [
    CommonModule,
    DynamicBlockRendererComponent,
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
    ContentWithImageComponent,
    // New Block Components
    VideoHeroComponent,
    SplitHeroComponent,
    MasonryGalleryComponent,
    ImageComparisonComponent,
    PricingTableComponent,
    TestimonialSliderComponent,
    TeamGridComponent
  ],
  template: `
    <!-- Wrapper with custom classes and inline styles for ALL blocks -->
    <div 
      [attr.data-block-id]="block?.id"
      [class]="getCombinedClasses()"
      [style]="getSafeInlineStyle()">
      
      <!-- Check if the block is registered in the new system -->
      <app-dynamic-block-renderer 
        *ngIf="isDynamic(block?.type); else legacyRenderer" 
        [block]="block">
      </app-dynamic-block-renderer>

      <!-- Fallback to legacy ngSwitch renderer -->
      <ng-template #legacyRenderer>
        <ng-container [ngSwitch]="block?.type">
          <!-- Hero Carousel -->
          <app-hero-carousel 
            *ngSwitchCase="'hero-carousel'" 
            [slides]="block.slides || []">
          </app-hero-carousel>
          
          <!-- Feature Grid -->
          <app-feature-grid 
            *ngSwitchCase="'feature-grid'" 
            [headline]="block.data?.headline || block.title" 
            [subheadline]="block.data?.subheadline || ''"
            [features]="block.data?.features || block.items || []">
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
            [header]="{ title: block.data?.header?.title || '' }"
            [stats]="block.data?.stats || block.stats || []"
            [styles]="block.styles">
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
          
          <!-- Page Hero (Legacy fallback, though now it's registered) -->
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
            [title]="block.data?.title || block.title"
            [items]="block.data?.items || block.items || []"
            [styles]="block.styles">
          </app-faq-accordion>
          
          <!-- Timeline Steps (Legacy fallback) -->
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
          
          <!-- Video Hero -->
          <app-video-hero 
            *ngSwitchCase="'video-hero'" 
            [videoUrl]="block.videoUrl"
            [posterImage]="block.posterImage"
            [title]="block.title"
            [subtitle]="block.subtitle"
            [cta]="block.cta"
            [overlayOpacity]="block.overlayOpacity || 60"
            [autoplay]="block.autoplay !== false"
            [loop]="block.loop !== false"
            [muted]="block.muted !== false">
          </app-video-hero>
          
          <!-- Split Hero -->
          <app-split-hero 
            *ngSwitchCase="'split-hero'" 
            [title]="block.title"
            [subtitle]="block.subtitle"
            [image]="block.image"
            [mediaPosition]="block.mediaPosition || 'right'"
            [cta]="block.cta"
            [secondaryCta]="block.secondaryCta"
            [features]="block.features || []">
          </app-split-hero>
          
          <!-- Masonry Gallery -->
          <app-masonry-gallery 
            *ngSwitchCase="'masonry-gallery'" 
            [title]="block.title"
            [subtitle]="block.subtitle"
            [images]="block.images || []"
            [columns]="block.columns || 3"
            [gap]="block.gap || 'md'"
            [enableLightbox]="block.enableLightbox !== false">
          </app-masonry-gallery>
          
          <!-- Image Comparison -->
          <app-image-comparison 
            *ngSwitchCase="'image-comparison'" 
            [title]="block.title"
            [beforeImage]="block.beforeImage"
            [afterImage]="block.afterImage"
            [beforeLabel]="block.beforeLabel || 'Before'"
            [afterLabel]="block.afterLabel || 'After'"
            [startPosition]="block.startPosition || 50"
            [orientation]="block.orientation || 'horizontal'">
          </app-image-comparison>
          
          <!-- Pricing Table -->
          <app-pricing-table 
            *ngSwitchCase="'pricing-table'" 
            [title]="block.title"
            [subtitle]="block.subtitle"
            [currency]="block.currency || '¥'"
            [plans]="block.plans || []">
          </app-pricing-table>
          
          <!-- Testimonial Slider -->
          <app-testimonial-slider 
            *ngSwitchCase="'testimonial-slider'" 
            [title]="block.title"
            [testimonials]="block.testimonials || []"
            [autoRotate]="block.autoRotate !== false"
            [rotateInterval]="block.rotateInterval || 5">
          </app-testimonial-slider>
          
          <!-- Team Grid -->
          <app-team-grid 
            *ngSwitchCase="'team-grid'" 
            [title]="block.title"
            [subtitle]="block.subtitle"
            [columns]="block.columns || 3"
            [cardStyle]="block.cardStyle || 'minimal'"
            [members]="block.members || []">
          </app-team-grid>
          
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
      </ng-template>
    </div>
  `
})
export class BlockRendererComponent {
  readonly block = input.required<any>();

  private registry = inject(BlockRegistryService);
  private styleValidator = inject(StyleValidatorService);
  private styleInjector = inject(StyleInjectorService);
  private sanitizer = inject(DomSanitizer);

  ngOnChanges(): void {
    // Inject custom CSS for legacy blocks too
    if (this.block?.styles) {
      this.styleInjector.injectBlockStyles(this.block);
    }
  }

  isDynamic(type: string | undefined): boolean {
    return !!type && !!this.registry.getComponent(type);
  }

  getCombinedClasses(): string {
    if (!this.block) return '';

    const parts: string[] = [];

    // From settings (legacy customClass field)
    if (this.block.settings?.customClass) {
      parts.push(this.block.settings.customClass);
    }

    // From styles.customClasses (new field)
    if (this.block.styles?.customClasses) {
      const validation = this.styleValidator.validateClasses(this.block.styles.customClasses);
      parts.push(validation.sanitizedValue);
    }

    return parts.join(' ').trim();
  }

  getSafeInlineStyle(): SafeStyle | null {
    if (!this.block?.styles?.inlineStyles) return null;

    const validation = this.styleValidator.validateInlineStyles(this.block.styles.inlineStyles);
    if (!validation.sanitizedValue) return null;

    return this.sanitizer.bypassSecurityTrustStyle(validation.sanitizedValue);
  }
}

