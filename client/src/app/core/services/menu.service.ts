import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface MenuItem {
    label: string;
    link: string;
    children?: MenuItem[];
}

export interface Menu {
    id: number;
    code: string;
    items_json: MenuItem[]; // We parse this on backend usually? check API
    // Actually API returns it as object if we did JSON.parse in backend?
    // Let's check API code. Yes: menu.items_json = JSON.parse(menu.items_json);
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
        return this.http.get<any>(`/api/menus/${code}`);
    }

    saveMenu(code: string, items: MenuItem[]) {
        return this.http.post('/api/menus', { code, items });
    }
}
