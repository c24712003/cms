import { Component, Inject, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/services/i18n.service';
import { CommonModule } from '@angular/common';

// Block Registry Imports
import { BlockRegistryService } from './features/content-blocks/block-registry.service';
import { PageHeroComponent } from './features/content-blocks/page-hero.component';
import { TimelineStepsComponent } from './features/content-blocks/timeline-steps.component';
import { CaseStudyShowcaseComponent } from './features/content-blocks/case-study-showcase.component';
import { HeroCarouselComponent } from './features/content-blocks/hero-carousel.component';
import { FeatureGridComponent } from './features/content-blocks/feature-grid.component';
import { CardCarouselComponent } from './features/content-blocks/card-carousel.component';
import { StatsCounterComponent } from './features/content-blocks/stats-counter.component';
import { CtaBannerComponent } from './features/content-blocks/cta-banner.component';
import { FaqAccordionComponent } from './features/content-blocks/faq-accordion.component';
import { ContactFormCtaComponent } from './features/content-blocks/contact-form-cta.component';
import { ContentWithImageComponent } from './features/content-blocks/content-with-image.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <router-outlet></router-outlet>
  `
})
export class App {
  constructor(
    public i18n: I18nService,
    @Inject(LOCALE_ID) public locale: string,
    private registry: BlockRegistryService
  ) {
    this.registerBlocks();
  }

  private registerBlocks() {
    // Core Content Blocks
    this.registry.register('page-hero', PageHeroComponent, PageHeroComponent.manifest);
    this.registry.register('timeline-steps', TimelineStepsComponent, TimelineStepsComponent.manifest);
    this.registry.register('case-study-showcase', CaseStudyShowcaseComponent, CaseStudyShowcaseComponent.manifest);
    this.registry.register('hero-carousel', HeroCarouselComponent, HeroCarouselComponent.manifest);
    this.registry.register('feature-grid', FeatureGridComponent, FeatureGridComponent.manifest);
    this.registry.register('card-carousel', CardCarouselComponent, CardCarouselComponent.manifest);
    this.registry.register('stats-counter', StatsCounterComponent, StatsCounterComponent.manifest);
    this.registry.register('cta-banner', CtaBannerComponent, CtaBannerComponent.manifest);
    this.registry.register('faq-accordion', FaqAccordionComponent, FaqAccordionComponent.manifest);
    this.registry.register('contact-form-cta', ContactFormCtaComponent, ContactFormCtaComponent.manifest);
    this.registry.register('content-with-image', ContentWithImageComponent, ContentWithImageComponent.manifest);
  }
}
