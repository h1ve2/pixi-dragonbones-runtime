/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {BaseObject} from "../core/index.js";
import {TextureAtlasData, TextureData} from "../model/index.js";
import {groupD8, Rectangle, Texture} from "pixi.js";

/**
 * [en] The PixiJS texture atlas data.
 *
 * [zh] PixiJS 贴图集数据。
 *
 * @version DragonBones 3.0
 */
export class PixiTextureAtlasData extends TextureAtlasData {
    public static toString(): string {
        return "[class dragonBones.PixiTextureAtlasData]";
    }

    private _renderTexture: Texture | null = null; // Initial value.

    protected _onClear(): void {
        super._onClear();

        if (this._renderTexture !== null) {
            // this._renderTexture.dispose();
        }

        this._renderTexture = null;
    }

    /**
     * @inheritDoc
     */
    public createTexture(): TextureData {
        return BaseObject.borrowObject(PixiTextureData);
    }

    /**
     * [en] The PixiJS texture.
     *
     * [zh] PixiJS 贴图。
     *
     * @version DragonBones 3.0
     */
    public get renderTexture(): Texture | null {
        return this._renderTexture;
    }

    public set renderTexture(value: Texture | null) {
        if (this._renderTexture === value) {
            return;
        }

        this._renderTexture = value;

        if (this._renderTexture !== null) {
            for (let k in this.textures) {
                const textureData = this.textures[k] as PixiTextureData;
                textureData.renderTexture = new Texture({
                    source: this._renderTexture.source,
                    frame: new Rectangle(textureData.region.x, textureData.region.y, textureData.region.width, textureData.region.height),
                    orig: new Rectangle(textureData.region.x, textureData.region.y, textureData.region.width, textureData.region.height),
                    trim: new Rectangle(0, 0, textureData.region.width, textureData.region.height),
                    rotate: textureData.rotated ? groupD8.S : 0,
                });

                // textureData.renderTexture = Texture.WHITE;
            }
        } else {
            for (let k in this.textures) {
                const textureData = this.textures[k] as PixiTextureData;
                textureData.renderTexture = null;
            }
        }
    }
}

/**
 * @internal
 */
export class PixiTextureData extends TextureData {
    public static toString(): string {
        return "[class dragonBones.PixiTextureData]";
    }

    public renderTexture: Texture | null = null; // Initial value.

    protected _onClear(): void {
        super._onClear();

        if (this.renderTexture !== null) {
            this.renderTexture.destroy(false);
        }

        this.renderTexture = null;
    }
}
