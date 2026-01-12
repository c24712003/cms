import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockManifest } from './block.types';

interface SocialLink {
  platform: string;
  url: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  socials?: SocialLink[];
}

@Component({
  selector: 'app-team-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 md:py-24 bg-white">
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
        
        <!-- Team Grid -->
        <div 
          class="grid gap-8"
          [class.md:grid-cols-2]="columns === 2"
          [class.md:grid-cols-3]="columns === 3"
          [class.md:grid-cols-4]="columns === 4">
          
          <div 
            *ngFor="let member of members" 
            class="group"
            [class.text-center]="cardStyle === 'minimal'"
            [class.bg-slate-50]="cardStyle === 'detailed'"
            [class.rounded-2xl]="cardStyle === 'detailed'"
            [class.p-6]="cardStyle === 'detailed'"
            [class.hover:shadow-xl]="cardStyle === 'detailed'"
            [class.transition-all]="cardStyle === 'detailed'"
            [class.duration-300]="cardStyle === 'detailed'">
            
            <!-- Photo -->
            <div 
              class="relative mb-4 overflow-hidden"
              [class.aspect-square]="true"
              [class.rounded-full]="cardStyle === 'minimal'"
              [class.mx-auto]="cardStyle === 'minimal'"
              [class.w-40]="cardStyle === 'minimal'"
              [class.h-40]="cardStyle === 'minimal'"
              [class.rounded-xl]="cardStyle === 'detailed'">
              <img 
                *ngIf="member.photo"
                [src]="member.photo" 
                [alt]="member.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div 
                *ngIf="!member.photo" 
                class="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span class="text-4xl text-white font-bold">{{ member.name.charAt(0) }}</span>
              </div>
              
              <!-- Social Overlay (Detailed style) -->
              <div 
                *ngIf="cardStyle === 'detailed' && member.socials?.length"
                class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <div class="flex gap-3">
                  <a 
                    *ngFor="let social of member.socials" 
                    [href]="social.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors">
                    <ng-container [ngSwitch]="social.platform">
                      <!-- Twitter/X -->
                      <svg *ngSwitchCase="'twitter'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <!-- LinkedIn -->
                      <svg *ngSwitchCase="'linkedin'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <!-- GitHub -->
                      <svg *ngSwitchCase="'github'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <!-- Default Link -->
                      <svg *ngSwitchDefault class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                      </svg>
                    </ng-container>
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Info -->
            <div>
              <h3 class="text-lg font-bold text-slate-900 mb-1">
                {{ member.name }}
              </h3>
              <p class="text-sm text-blue-600 font-medium mb-2">
                {{ member.role }}
              </p>
              <p 
                *ngIf="member.bio && cardStyle === 'detailed'" 
                class="text-sm text-slate-600 leading-relaxed">
                {{ member.bio }}
              </p>
              
              <!-- Social Links (Minimal style) -->
              <div 
                *ngIf="cardStyle === 'minimal' && member.socials?.length" 
                class="flex justify-center gap-2 mt-4">
                <a 
                  *ngFor="let social of member.socials" 
                  [href]="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-slate-100 hover:bg-blue-100 rounded-full flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors">
                  <ng-container [ngSwitch]="social.platform">
                    <svg *ngSwitchCase="'twitter'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <svg *ngSwitchCase="'linkedin'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <svg *ngSwitchCase="'github'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <svg *ngSwitchDefault class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                    </svg>
                  </ng-container>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class TeamGridComponent {
  static manifest: ContentBlockManifest = {
    type: 'team-grid',
    displayName: 'Team Member Grid',
    category: 'Content',
    description: 'Team member showcase grid',
    schema: {
      properties: {
        title: { type: 'string', title: 'Title' },
        subtitle: { type: 'string', title: 'Subtitle', ui: { widget: 'textarea' } },
        columns: {
          type: 'number',
          title: 'Columns',
          enum: [2, 3, 4],
          default: 3,
          ui: { widget: 'select' }
        },
        cardStyle: {
          type: 'string',
          title: 'Card Style',
          enum: ['minimal', 'detailed'],
          default: 'minimal',
          ui: { widget: 'select' }
        },
        members: {
          type: 'array',
          title: 'Team Members',
          ui: { widget: 'array', addLabel: 'Add Member' },
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', title: 'Name' },
              role: { type: 'string', title: 'Job Title' },
              bio: { type: 'string', title: 'Short Bio', ui: { widget: 'textarea' } },
              photo: { type: 'string', title: 'Photo', ui: { widget: 'image' } },
              socials: {
                type: 'array',
                title: 'Social Links',
                ui: { widget: 'array', addLabel: 'Add Social' },
                items: {
                  type: 'object',
                  properties: {
                    platform: {
                      type: 'string',
                      title: 'Platform',
                      enum: ['twitter', 'linkedin', 'github', 'other'],
                      ui: { widget: 'select' }
                    },
                    url: { type: 'string', title: 'URL' }
                  }
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
  @Input() columns: number = 3;
  @Input() cardStyle: 'minimal' | 'detailed' = 'minimal';
  @Input() members: TeamMember[] = [];
}
