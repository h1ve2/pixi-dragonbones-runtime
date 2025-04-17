import {Assets, path} from "pixi.js";

/**
 * [en] Get the alias for an asset.
 *
 * [zh] 获取资源的别名。
 *
 * @param obj - [en] The asset object.
 * @param obj - [zh] 资源对象。
 *
 * @returns [en] The alias of the asset.
 * @returns [zh] 资源的别名。
 */
export function getAlias(obj: Object): string {
    // @ts-ignore
    const cache: Map<string, Object> = Assets.cache._cache;

    for (const [key, value] of cache) {
        if (value !== obj) continue;

        return key;
    }

    return null;
}

/**
 * [en] Convert the alias of an asset from one path to another.
 *
 * [zh] 将资源的别名从一个路径转换到另一个路径。
 *
 * @param from - [en] The original alias path.
 * @param from - [zh] 原始别名路径。
 *
 * @param to - [en] The new alias (file name).
 * @param to - [zh] 新的别名 (文件名称)。
 *
 * @returns [en] The new alias path.
 * @returns [zh] 新的别名路径。
 */
export function convertAlias(from: string, to: string): string {
    const dir = path.dirname(from);
    return path.join(dir, to);
}