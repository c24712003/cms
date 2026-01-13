
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface MenuItem {
    id?: string;
    parent_id?: string;
    label: string; // Mapped to title in DB
    labelKey?: string;
    link: string;  // Mapped to url in DB
    link_type?: 'internal' | 'external';
    target?: '_self' | '_blank';
    icon?: string;
    is_visible?: boolean;
    children?: MenuItem[];
    expanded?: boolean; // UI state
}

export interface SocialLink {
    id?: string;
    platform: string;
    name: string;
    url: string;
    icon_path?: string;
    is_active: boolean;
    item_order?: number;
}

export interface Menu {
    code: string;
    items: MenuItem[];
}

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    constructor(private http: HttpClient) { }

    getMenus() {
        return this.http.get<any[]>('/api/menus');
    }

    getMenu(code: string) {
        return this.http.get<Menu>(`/api/menus/${code}`).pipe(
            map(response => {
                // Ensure items is an array, backend might return it in specific property
                // My backend returns { ...menu, items: tree }
                // We might need to map 'title' to 'label' and 'url' to 'link' if backend sends 'title/url'
                // My backend sends what matches DB columns: title, url.
                // So I should map them or update frontend to use title/url.
                // Let's update frontend to handle both or map it here.
                // Mapping here is safer for existing components.
                const mapItem = (item: any): MenuItem => ({
                    id: item.id,
                    label: item.title || item.label || '',
                    labelKey: item.translation_key, // Map DB column to frontend property
                    link: item.url || item.link || '',
                    link_type: item.link_type,
                    target: item.target,
                    icon: item.icon,
                    is_visible: item.is_visible !== 0 && item.is_visible !== false,
                    children: item.children ? item.children.map(mapItem) : [],
                    expanded: true // Default expanded
                });

                return {
                    code: response.code,
                    items: Array.isArray(response.items) ? response.items.map(mapItem) : []
                };
            })
        );
    }

    saveMenu(code: string, items: MenuItem[]) {
        // Map back if needed, but backend handles label/link aliases.
        return this.http.post('/api/menus/' + code, { items });
    }

    getSocialLinks() {
        return this.http.get<any>('/api/menus/social/links').pipe(
            map(res => {
                const links = Array.isArray(res) ? res : (res.links || []);
                return Array.isArray(links) ? links : [];
            })
        );
    }

    saveSocialLinks(links: SocialLink[]) {
        return this.http.post('/api/menus/social/links', { links });
    }
}
