import {Assets, path} from "pixi.js";

/**
 * get asset alias
 * @param asset asset object
 */
export function getAlias(asset: Object): string {
    // @ts-ignore
    const caches: Map<string, Object> = Assets.cache._cache;

    for (const [alias, obj] of caches) {
        if (obj !== asset) continue;

        return alias;
    }

    return null;
}

/**
 * convert alias
 * @param from original url
 * @param to filename
 */
export function convertAlias(from: string, to: string): string {
    return path.join(path.dirname(from), to);
}