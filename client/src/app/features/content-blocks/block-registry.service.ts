import { Injectable, Type } from '@angular/core';
import { ContentBlockManifest } from './block.types';

export interface BlockDefinition {
    component: Type<any>;
    manifest: ContentBlockManifest;
}

@Injectable({
    providedIn: 'root'
})
export class BlockRegistryService {
    private blocks = new Map<string, BlockDefinition>();

    register(type: string, component: Type<any>, manifest: ContentBlockManifest) {
        if (this.blocks.has(type)) {
            console.warn(`Block type "${type}" is already registered. Overwriting.`);
        }
        this.blocks.set(type, { component, manifest });
    }

    getDefinition(type: string): BlockDefinition | undefined {
        return this.blocks.get(type);
    }

    getComponent(type: string): Type<any> | undefined {
        return this.blocks.get(type)?.component;
    }

    getManifest(type: string): ContentBlockManifest | undefined {
        return this.blocks.get(type)?.manifest;
    }

    getAllManifests(): ContentBlockManifest[] {
        return Array.from(this.blocks.values()).map(b => b.manifest);
    }
}
