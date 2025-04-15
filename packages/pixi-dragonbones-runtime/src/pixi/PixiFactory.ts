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

import {WorldClock} from "../animation/index.js";
import {Armature, Slot} from "../armature/index.js";
import {DragonBones, BaseObject} from "../core/index.js";
import {BaseFactory, BuildArmaturePackage} from "../factory/index.js";
import {DragonBonesData, SlotData, TextureAtlasData} from "../model/index.js";
import {DataParser} from "../parser/index.js";
import {PixiArmatureDisplay} from "./PixiArmatureDisplay.js";
import {PixiSlot} from "./PixiSlot.js";
import {PixiTextureAtlasData, PixiTextureData} from "./PixiTextureAtlasData.js";
import {Assets, MeshSimple, Sprite, Texture, Ticker} from "pixi.js";

interface BuildArmatureOptions {
    dragonBonesName?: string
    skinName?: string
    textureAtlasName?: string
    clock?: WorldClock | null
    throwOnError?: boolean
}

/**
 * [en] The PixiJS factory.
 *
 * [zh] PixiJS 工厂。
 *
 * @version DragonBones 3.0
 */
export class PixiFactory extends BaseFactory {
    private static _dragonBonesInstance: DragonBones = null as any;
    private static _factory: PixiFactory = null as any;
    private static _clockHandler(ticker: Ticker): void {
        this._dragonBonesInstance.advanceTime(ticker.deltaMS / 1000);
    }

    /*
        * `passedTime` is elapsed time, specified in seconds.
        */
    public static advanceTime(passedTime: number): void {
        if (this._dragonBonesInstance) {
            this._dragonBonesInstance.advanceTime(passedTime);
        }
    }

    /*
    * whether use `PIXI.Ticker.shared`
    */
    public static useSharedTicker: boolean = true;

    /**
     * [en] A global factory instance that can be used directly.
     *
     * [zh] 一个可以直接使用的全局工厂实例。
     *
     * @version DragonBones 4.7
     */
    public static get factory(): PixiFactory {
        if (PixiFactory._factory === null) {
            PixiFactory._factory = new PixiFactory(null, PixiFactory.useSharedTicker);
        }

        return PixiFactory._factory;
    }


    /**
     * - 一个获取全局工厂实例(单例)的方法, 和get factory相比, 优点是可以传参数。
     * @version DragonBones 4.7
     */
    public static newInstance(useSharedTicker = true): PixiFactory {
        if (PixiFactory._factory === null) {
            PixiFactory._factory = new PixiFactory(null, useSharedTicker);
        }

        return PixiFactory._factory;
    }

    /**
     * @inheritDoc
     */
    public constructor(dataParser: DataParser | null = null, useSharedTicker = true) {
        super(dataParser);

        if (PixiFactory._dragonBonesInstance === null) {
            const eventManager = new PixiArmatureDisplay();
            PixiFactory._dragonBonesInstance = new DragonBones(eventManager);
            if (useSharedTicker) {
                Ticker.shared.add(PixiFactory._clockHandler, PixiFactory);
            }
        }

        this._dragonBones = PixiFactory._dragonBonesInstance;
    }

    protected _buildTextureAtlasData(textureAtlasData: PixiTextureAtlasData | null, textureAtlas: Texture | null): PixiTextureAtlasData {
        if (textureAtlasData) {
            textureAtlasData.renderTexture = textureAtlas;
        } else {
            textureAtlasData = BaseObject.borrowObject(PixiTextureAtlasData);
        }

        return textureAtlasData;
    }

    protected _buildArmature(dataPackage: BuildArmaturePackage): Armature {
        const armature = BaseObject.borrowObject(Armature);
        const armatureDisplay = new PixiArmatureDisplay();

        armature.init(
            dataPackage.armature,
            armatureDisplay, armatureDisplay, this._dragonBones
        );

        return armature;
    }

    protected _buildSlot(_dataPackage: BuildArmaturePackage, slotData: SlotData, armature: Armature): Slot {
        const slot = BaseObject.borrowObject(PixiSlot);
        slot.init(
            slotData, armature,
            new Sprite(Texture.EMPTY), new MeshSimple({
                texture: Texture.EMPTY
            })
        );

        return slot;
    }

    /**
     * [en] Create a armature from cached DragonBonesData instances and TextureAtlasData instances, then use the {@link #clock} to update it.
     * The difference is that the armature created by {@link #buildArmature} is not WorldClock instance update.
     *
     * [zh] 通过缓存的 DragonBonesData 实例和 TextureAtlasData 实例创建一个骨架，并用 {@link #clock} 更新该骨架。
     * 区别在于由 {@link #buildArmature} 创建的骨架没有 WorldClock 实例驱动。
     *
     * @param armatureName - [en] The armature data name.
     * @param armatureName - [zh] 骨架数据名称。
     *
     * @param dragonBonesName - [en] The cached name of the DragonBonesData instance. (If not set, all DragonBonesData instances are retrieved, and when multiple DragonBonesData instances contain a the same name armature data, it may not be possible to accurately create a specific armature)
     * @param dragonBonesName - [zh] DragonBonesData 实例的缓存名称。 （如果未设置，将检索所有的 DragonBonesData 实例，当多个 DragonBonesData 实例中包含同名的骨架数据时，可能无法准确的创建出特定的骨架）
     *
     * @param skinName - [en] The skin name, you can set a different ArmatureData name to share it's skin data. (If not set, use the default skin data)
     * @param skinName - [zh] 皮肤名称，可以设置一个其他骨架数据名称来共享其皮肤数据。 （如果未设置，则使用默认的皮肤数据）
     *
     * @returns [en] The armature display container.
     * @returns [zh] 骨架的显示容器。
     *
     * @see IArmatureProxy
     * @see BaseFactory#buildArmature
     * @version DragonBones 4.5
     * @example
     * ```ts
     *     let armatureDisplay = factory.buildArmatureDisplay("armatureName", "dragonBonesName");
     * ```
     */
    public buildArmatureDisplay(armatureName: string, dragonBonesName: string = "", skinName: string = "", textureAtlasName: string = ""): PixiArmatureDisplay | null {
        const armature = this.buildArmature(armatureName, dragonBonesName || "", skinName || "", textureAtlasName || "");
        if (armature !== null) {
            this._dragonBones.clock.add(armature);

            return armature.display as PixiArmatureDisplay;
        }

        return null;
    }

    /**
     * [en] Create the display object with the specified texture.
     *
     * [zh] 创建带有指定贴图的显示对象。
     *
     * @param textureName - [en] The texture data name.
     * @param textureName - [zh] 贴图数据名称。
     *
     * @param textureAtlasName - [en] The texture atlas data name (Of not set, all texture atlas data will be searched)
     * @param textureAtlasName - [zh] 贴图集数据名称。 （如果未设置，将检索所有的贴图集数据）
     *
     * @version DragonBones 3.0
     */
    public getTextureDisplay(textureName: string, textureAtlasName: string | null = null): Sprite | null {
        const textureData = this._getTextureData(textureAtlasName !== null ? textureAtlasName : "", textureName) as PixiTextureData;
        if (textureData !== null && textureData.renderTexture !== null) {
            return new Sprite(textureData.renderTexture);
        }

        return null;
    }

    /**
     * [en] A global sound event manager.
     * Sound events can be listened to uniformly from the manager.
     *
     * [zh] 全局声音事件管理器。
     * 声音事件可以从该管理器统一侦听。
     *
     * @version DragonBones 4.5
     */
    public get soundEventManager(): PixiArmatureDisplay {
        return this._dragonBones.eventManager as PixiArmatureDisplay;
    }

    /**
     * [en] Parse the raw data to a DragonBonesData instance and cache it to the factory.
     *
     * [zh] 将原始数据解析为 DragonBonesData 实例，并缓存到工厂中。
     *
     * @param rawData - [en] The raw data.
     * @param rawData - [zh] 原始数据。
     *
     * @param name - [en] Specify a cache name for the instance so that the instance can be obtained through this name. (If not set, use the instance name instead)
     * @param name - [zh] 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
     *
     * @param scale - [en] Specify a scaling value for all armatures. (Default: 1.0)
     * @param scale - [zh] 为所有的骨架指定一个缩放值。 （默认: 1.0）
     *
     * @returns [en] DragonBonesData instance
     * @returns [zh] DragonBonesData 实例
     *
     * @see #getDragonBonesData()
     * @see #addDragonBonesData()
     * @see #removeDragonBonesData()
     * @see DragonBonesData
     * @version DragonBones 4.5
     */
    public parseDragonBonesData(rawData: string | Object, name: string | null = null, scale: number = 1.0): DragonBonesData | null {
        if (typeof rawData === "string") {
            rawData = Assets.cache.get(rawData);
        }
        return super.parseDragonBonesData(rawData, name, scale);
    }


    /**
     * [en] Parse the raw texture atlas data and the texture atlas object to a TextureAtlasData instance and cache it to the factory.
     *
     * [zh] 将原始贴图集数据和贴图集对象解析为 TextureAtlasData 实例，并缓存到工厂中。
     *
     * @param rawData - [en] The raw texture atlas data.
     * @param rawData - [zh] 原始贴图集数据。
     *                       如果传入string，则从缓存中按别名查找
     *
     * @param textureAtlas - [en] The texture atlas object.
     * @param textureAtlas - [zh] 贴图集对象。
     *                            如果传入string，则从缓存中按别名查找
     *
     * @param name - [en] Specify a cache name for the instance so that the instance can be obtained through this name. (If not set, use the instance name instead)
     * @param name - [zh] 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
     *
     * @param scale - [en] Specify a scaling value for the map set. (Default: 1.0)
     * @param scale - [zh] 为贴图集指定一个缩放值。 （默认: 1.0）
     *
     * @returns [en] TextureAtlasData instance
     * @returns [zh] TextureAtlasData 实例
     *
     * @see #getTextureAtlasData()
     * @see #addTextureAtlasData()
     * @see #removeTextureAtlasData()
     * @see TextureAtlasData
     * @version DragonBones 4.5
     */
    public parseTextureAtlasData(rawData: string | Object, textureAtlas: string | Texture, name: string | null = null, scale: number = 1.0): TextureAtlasData {
        if (typeof rawData === "string") {
            rawData = Assets.cache.get(rawData);
        }

        if (typeof textureAtlas === "string") {
            textureAtlas = Assets.cache.get(textureAtlas);
        }
        return super.parseTextureAtlasData(rawData, textureAtlas, name,scale);
    }
}

