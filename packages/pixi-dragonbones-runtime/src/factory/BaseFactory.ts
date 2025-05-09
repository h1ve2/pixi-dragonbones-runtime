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

import { WorldClock } from "../animation/index.js";
import { Armature, Bone, Surface, IKConstraint, PathConstraint, Slot } from "../armature/index.js";
import { DragonBones, BaseObject, BoneType, ConstraintType, DisplayType } from "../core/index.js";
import { EventObject } from "../event/index.js";
import { DragonBonesData, TextureAtlasData, TextureData, ArmatureData, DisplayData, ArmatureDisplayData, ImageDisplayData, MeshDisplayData, SlotData, SkinData, AnimationData } from "../model/index.js";
import { ObjectDataParser, BinaryDataParser, DataParser } from "../parser/index.js";

/**
 * [en] Base class for the factory that create the armatures. (Typically only one global factory instance is required)
 * The factory instance create armatures by parsed and added DragonBonesData instances and TextureAtlasData instances.
 * Once the data has been parsed, it has been cached in the factory instance and does not need to be parsed again until it is cleared by the factory instance.
 *
 * [zh] 创建骨架的工厂基类。 （通常只需要一个全局工厂实例）
 * 工厂通过解析并添加的 DragonBonesData 实例和 TextureAtlasData 实例来创建骨架。
 * 当数据被解析过之后，已经添加到工厂中，在没有被工厂清理之前，不需要再次解析。
 *
 * @see DragonBonesData
 * @see TextureAtlasData
 * @see ArmatureData
 * @see Armature
 * @version DragonBones 3.0
 */
export abstract class BaseFactory {
    protected static _objectParser: ObjectDataParser = null as any;
    protected static _binaryParser: BinaryDataParser = null as any;
    /**
     * @private
     */
    public autoSearch: boolean = false;

    protected readonly _dragonBonesDataMap: Record<string, DragonBonesData> = {};
    protected readonly _textureAtlasDataMap: Record<string, Array<TextureAtlasData>> = {};
    protected _dragonBones: DragonBones = null as any;
    protected _dataParser: DataParser = null as any;
    /**
     * [en] Create a factory instance. (typically only one global factory instance is required)
     *
     * [zh] 创建一个工厂实例。 （通常只需要一个全局工厂实例）
     *
     * @version DragonBones 3.0
     */
    public constructor(dataParser: DataParser | null = null) {
        if (BaseFactory._objectParser === null) {
            BaseFactory._objectParser = new ObjectDataParser();
        }

        if (BaseFactory._binaryParser === null) {
            BaseFactory._binaryParser = new BinaryDataParser();
        }

        this._dataParser = dataParser !== null ? dataParser : BaseFactory._objectParser;
    }

    protected _isSupportMesh(): boolean {
        return true;
    }

    protected _getTextureData(textureAtlasName: string, textureName: string): TextureData | null {
        if (textureAtlasName in this._textureAtlasDataMap) {
            for (const textureAtlasData of this._textureAtlasDataMap[textureAtlasName]) {
                const textureData = textureAtlasData.getTexture(textureName);
                if (textureData !== null) {
                    return textureData;
                }
            }
        }

        if (this.autoSearch) { // Will be search all data, if the autoSearch is true.
            for (let k in this._textureAtlasDataMap) {
                for (const textureAtlasData of this._textureAtlasDataMap[k]) {
                    if (textureAtlasData.autoSearch) {
                        const textureData = textureAtlasData.getTexture(textureName);
                        if (textureData !== null) {
                            return textureData;
                        }
                    }
                }
            }
        }

        return null;
    }

    protected _fillBuildArmaturePackage(
        dataPackage: BuildArmaturePackage,
        dragonBonesName: string, armatureName: string, skinName: string, textureAtlasName: string
    ): boolean {
        let dragonBonesData: DragonBonesData | null = null;
        let armatureData: ArmatureData | null = null;

        if (dragonBonesName.length > 0) {
            if (dragonBonesName in this._dragonBonesDataMap) {
                dragonBonesData = this._dragonBonesDataMap[dragonBonesName];
                armatureData = dragonBonesData.getArmature(armatureName);
            }
        }

        if (armatureData === null && (dragonBonesName.length === 0 || this.autoSearch)) { // Will be search all data, if do not give a data name or the autoSearch is true.
            for (let k in this._dragonBonesDataMap) {
                dragonBonesData = this._dragonBonesDataMap[k];
                if (dragonBonesName.length === 0 || dragonBonesData.autoSearch) {
                    armatureData = dragonBonesData.getArmature(armatureName);
                    if (armatureData !== null) {
                        dragonBonesName = k;
                        break;
                    }
                }
            }
        }

        if (armatureData !== null) {
            dataPackage.dataName = dragonBonesName;
            dataPackage.textureAtlasName = textureAtlasName;
            dataPackage.data = dragonBonesData as any;
            dataPackage.armature = armatureData;
            dataPackage.skin = null;

            if (skinName.length > 0) {
                dataPackage.skin = armatureData.getSkin(skinName);
                if (dataPackage.skin === null && this.autoSearch) {
                    for (let k in this._dragonBonesDataMap) {
                        const skinDragonBonesData = this._dragonBonesDataMap[k];
                        const skinArmatureData = skinDragonBonesData.getArmature(skinName);
                        if (skinArmatureData !== null) {
                            dataPackage.skin = skinArmatureData.defaultSkin;
                            break;
                        }
                    }
                }
            }

            if (dataPackage.skin === null) {
                dataPackage.skin = armatureData.defaultSkin;
            }

            return true;
        }

        return false;
    }

    protected _buildBones(dataPackage: BuildArmaturePackage, armature: Armature): void {
        for (const boneData of dataPackage.armature.sortedBones) {
            const bone = BaseObject.borrowObject(boneData.type === BoneType.Bone ? Bone : Surface);
            bone.init(boneData, armature);
        }
    }
    /**
     * @private
     */
    protected _buildSlots(dataPackage: BuildArmaturePackage, armature: Armature): void {
        const currentSkin = dataPackage.skin;
        const defaultSkin = dataPackage.armature.defaultSkin;
        if (currentSkin === null || defaultSkin === null) {
            return;
        }

        const skinSlots: Record<string, Array<DisplayData | null>> = {};
        for (let k in defaultSkin.displays) {
            const displays = defaultSkin.getDisplays(k) as any;
            skinSlots[k] = displays;
        }

        if (currentSkin !== defaultSkin) {
            for (let k in currentSkin.displays) {
                const displays = currentSkin.getDisplays(k) as any;
                skinSlots[k] = displays;
            }
        }

        for (const slotData of dataPackage.armature.sortedSlots) {
            const displayDatas = slotData.name in skinSlots ? skinSlots[slotData.name] : null;
            const slot = this._buildSlot(dataPackage, slotData, armature);

            if (displayDatas !== null) {
                slot.displayFrameCount = displayDatas.length;
                for (let i = 0, l = slot.displayFrameCount; i < l; ++i) {
                    const displayData = displayDatas[i];
                    slot.replaceRawDisplayData(displayData, i);

                    if (displayData !== null) {
                        if (dataPackage.textureAtlasName.length > 0) {
                            const textureData = this._getTextureData(dataPackage.textureAtlasName, displayData.path);
                            slot.replaceTextureData(textureData, i);
                        }

                        const display = this._getSlotDisplay(dataPackage, displayData, slot);
                        slot.replaceDisplay(display, i);
                    }
                    else {
                        slot.replaceDisplay(null);
                    }
                }
            }

            slot._setDisplayIndex(slotData.displayIndex, true);
        }
    }

    protected _buildConstraints(dataPackage: BuildArmaturePackage, armature: Armature): void {
        const constraints = dataPackage.armature.constraints;
        for (let k in constraints) {
            const constraintData = constraints[k];
            // TODO more constraint type.
            switch (constraintData.type) {
                case ConstraintType.IK:
                    const ikConstraint = BaseObject.borrowObject(IKConstraint);
                    ikConstraint.init(constraintData, armature);
                    armature._addConstraint(ikConstraint);
                    break;

                case ConstraintType.Path:
                    const pathConstraint = BaseObject.borrowObject(PathConstraint);
                    pathConstraint.init(constraintData, armature);
                    armature._addConstraint(pathConstraint);
                    break;

                default:
                    const constraint = BaseObject.borrowObject(IKConstraint);
                    constraint.init(constraintData, armature);
                    armature._addConstraint(constraint);
                    break;
            }

        }
    }

    protected _buildChildArmature(dataPackage: BuildArmaturePackage | null, _slot: Slot, displayData: ArmatureDisplayData): Armature | null {
        return this.buildArmature(displayData.path, dataPackage !== null ? dataPackage.dataName : "", "", dataPackage !== null ? dataPackage.textureAtlasName : "");
    }

    protected _getSlotDisplay(dataPackage: BuildArmaturePackage | null, displayData: DisplayData, slot: Slot): any {
        const dataName = dataPackage !== null ? dataPackage.dataName : displayData.parent.parent.parent.name;
        let display: any = null;
        switch (displayData.type) {
            case DisplayType.Image: {
                const imageDisplayData = displayData as ImageDisplayData;
                if (imageDisplayData.texture === null) {
                    imageDisplayData.texture = this._getTextureData(dataName, displayData.path);
                }

                display = slot.rawDisplay;
                break;
            }

            case DisplayType.Mesh: {
                const meshDisplayData = displayData as MeshDisplayData;
                if (meshDisplayData.texture === null) {
                    meshDisplayData.texture = this._getTextureData(dataName, meshDisplayData.path);
                }

                if (this._isSupportMesh()) {
                    display = slot.meshDisplay;
                }
                else {
                    display = slot.rawDisplay;
                }
                break;
            }

            case DisplayType.Armature: {
                const armatureDisplayData = displayData as ArmatureDisplayData;
                const childArmature = this._buildChildArmature(dataPackage, slot, armatureDisplayData);
                if (childArmature !== null) {
                    childArmature.inheritAnimation = armatureDisplayData.inheritAnimation;
                    if (!childArmature.inheritAnimation) {
                        const actions = armatureDisplayData.actions.length > 0 ? armatureDisplayData.actions : childArmature.armatureData.defaultActions;
                        if (actions.length > 0) {
                            for (const action of actions) {
                                const eventObject = BaseObject.borrowObject(EventObject);
                                EventObject.actionDataToInstance(action, eventObject, slot.armature);
                                eventObject.slot = slot;
                                slot.armature._bufferAction(eventObject, false);
                            }
                        }
                        else {
                            childArmature.animation.play();
                        }
                    }

                    armatureDisplayData.armature = childArmature.armatureData; //
                }

                display = childArmature;
                break;
            }

            case DisplayType.BoundingBox:
                break;

            default:
                break;
        }

        return display;
    }

    protected abstract _buildTextureAtlasData(textureAtlasData: TextureAtlasData | null, textureAtlas: any): TextureAtlasData;
    protected abstract _buildArmature(dataPackage: BuildArmaturePackage): Armature;
    protected abstract _buildSlot(dataPackage: BuildArmaturePackage, slotData: SlotData, armature: Armature): Slot;
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
    public parseDragonBonesData(rawData: any, name: string | null = null, scale: number = 1.0): DragonBonesData | null {
        const dataParser = rawData instanceof ArrayBuffer ? BaseFactory._binaryParser : this._dataParser;
        const dragonBonesData = dataParser.parseDragonBonesData(rawData, scale);

        while (true) {
            const textureAtlasData = this._buildTextureAtlasData(null, null);
            if (dataParser.parseTextureAtlasData(null, textureAtlasData, scale)) {
                this.addTextureAtlasData(textureAtlasData, name);
            }
            else {
                textureAtlasData.returnToPool();
                break;
            }
        }

        if (dragonBonesData !== null) {
            this.addDragonBonesData(dragonBonesData, name);
        }

        return dragonBonesData;
    }
    /**
     * [en] Parse the raw texture atlas data and the texture atlas object to a TextureAtlasData instance and cache it to the factory.
     *
     * [zh] 将原始贴图集数据和贴图集对象解析为 TextureAtlasData 实例，并缓存到工厂中。
     *
     * @param rawData - [en] The raw texture atlas data.
     * @param rawData - [zh] 原始贴图集数据。
     *
     * @param textureAtlas - [en] The texture atlas object.
     * @param textureAtlas - [zh] 贴图集对象。
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
    public parseTextureAtlasData(rawData: any, textureAtlas: any, name: string | null = null, scale: number = 1.0): TextureAtlasData {
        const textureAtlasData = this._buildTextureAtlasData(null, null);
        this._dataParser.parseTextureAtlasData(rawData, textureAtlasData, scale);
        this._buildTextureAtlasData(textureAtlasData, textureAtlas || null);
        this.addTextureAtlasData(textureAtlasData, name);

        return textureAtlasData;
    }
    /**
     * [en] Update texture atlases.
     *
     * [zh] 更新贴图集对象。
     *
     * @param textureAtlases - [en] The texture atlas objects.
     * @param textureAtlases - [zh] 多个贴图集对象。
     *
     * @param name - [en] The texture atlas name.
     * @param name - [zh] 贴图集名称。
     *
     * @version DragonBones 5.7
     */
    public updateTextureAtlases(textureAtlases: Array<any>, name: string): void {
        const textureAtlasDatas = this.getTextureAtlasData(name);
        if (textureAtlasDatas !== null) {
            for (let i = 0, l = textureAtlasDatas.length; i < l; ++i) {
                if (i < textureAtlases.length) {
                    this._buildTextureAtlasData(textureAtlasDatas[i], textureAtlases[i]);
                }
            }
        }
    }
    /**
     * [en] Get a specific DragonBonesData instance.
     *
     * [zh] 获取特定的 DragonBonesData 实例。
     *
     * @param name - [en] The DragonBonesData instance cache name.
     * @param name - [zh] DragonBonesData 实例的缓存名称。
     *
     * @returns [en] DragonBonesData instance
     * @returns [zh] DragonBonesData 实例
     *
     * @see #parseDragonBonesData()
     * @see #addDragonBonesData()
     * @see #removeDragonBonesData()
     * @see DragonBonesData
     * @version DragonBones 3.0
     */
    public getDragonBonesData(name: string): DragonBonesData | null {
        return (name in this._dragonBonesDataMap) ? this._dragonBonesDataMap[name] : null;
    }
    /**
     * [en] Cache a DragonBonesData instance to the factory.
     *
     * [zh] 将 DragonBonesData 实例缓存到工厂中。
     *
     * @param data - [en] The DragonBonesData instance.
     * @param data - [zh] DragonBonesData 实例。
     *
     * @param name - [en] Specify a cache name for the instance so that the instance can be obtained through this name. (if not set, use the instance name instead)
     * @param name - [zh] 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
     *
     * @see #parseDragonBonesData()
     * @see #getDragonBonesData()
     * @see #removeDragonBonesData()
     * @see DragonBonesData
     * @version DragonBones 3.0
     */
    public addDragonBonesData(data: DragonBonesData, name: string | null = null): void {
        name = name !== null ? name : data.name;
        if (name in this._dragonBonesDataMap) {
            if (this._dragonBonesDataMap[name] === data) {
                return;
            }

            console.warn("Can not add same name data: " + name);
            return;
        }

        this._dragonBonesDataMap[name] = data;
    }
    /**
     * [en] Remove a DragonBonesData instance.
     *
     * [zh] 移除 DragonBonesData 实例。
     *
     * @param name - [en] The DragonBonesData instance cache name.
     * @param name - [zh] DragonBonesData 实例缓存名称。
     *
     * @param disposeData - [en] Whether to dispose data. (Default: true)
     * @param disposeData - [zh] 是否释放数据。 （默认: true）
     *
     * @see #parseDragonBonesData()
     * @see #getDragonBonesData()
     * @see #addDragonBonesData()
     * @see DragonBonesData
     * @version DragonBones 3.0
     */
    public removeDragonBonesData(name: string, disposeData: boolean = true): void {
        if (name in this._dragonBonesDataMap) {
            if (disposeData) {
                this._dragonBones.bufferObject(this._dragonBonesDataMap[name]);
            }

            delete this._dragonBonesDataMap[name];
        }
    }
    /**
     * [en] Get a list of specific TextureAtlasData instances.
     *
     * [zh] 获取特定的 TextureAtlasData 实例列表。
     *
     * @param name - [en] The TextureAtlasData cahce name.
     * @param name - [zh] TextureAtlasData 实例缓存名称。
     *
     * @see #parseTextureAtlasData()
     * @see #addTextureAtlasData()
     * @see #removeTextureAtlasData()
     * @see TextureAtlasData
     * @version DragonBones 3.0
     */
    public getTextureAtlasData(name: string): Array<TextureAtlasData> | null {
        return (name in this._textureAtlasDataMap) ? this._textureAtlasDataMap[name] : null;
    }
    /**
     * [en] Cache a TextureAtlasData instance to the factory.
     *
     * [zh] 将 TextureAtlasData 实例缓存到工厂中。
     *
     * @param data - [en] The TextureAtlasData instance.
     * @param data - [zh] TextureAtlasData 实例。
     *
     * @param name - [en] Specify a cache name for the instance so that the instance can be obtained through this name. (if not set, use the instance name instead)
     * @param name - [zh] 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
     *
     * @see #parseTextureAtlasData()
     * @see #getTextureAtlasData()
     * @see #removeTextureAtlasData()
     * @see TextureAtlasData
     * @version DragonBones 3.0
     */
    public addTextureAtlasData(data: TextureAtlasData, name: string | null = null): void {
        name = name !== null ? name : data.name;
        const textureAtlasList = (name in this._textureAtlasDataMap) ? this._textureAtlasDataMap[name] : (this._textureAtlasDataMap[name] = []);
        if (textureAtlasList.indexOf(data) < 0) {
            textureAtlasList.push(data);
        }
    }
    /**
     * [en] Remove a TextureAtlasData instance.
     *
     * [zh] 移除 TextureAtlasData 实例。
     *
     * @param name - [en] The TextureAtlasData instance cache name.
     * @param name - [zh] TextureAtlasData 实例的缓存名称。
     *
     * @param disposeData - [en] Whether to dispose data.
     * @param disposeData - [zh] 是否释放数据。
     *
     * @see #parseTextureAtlasData()
     * @see #getTextureAtlasData()
     * @see #addTextureAtlasData()
     * @see TextureAtlasData
     * @version DragonBones 3.0
     */
    public removeTextureAtlasData(name: string, disposeData: boolean = true): void {
        if (name in this._textureAtlasDataMap) {
            const textureAtlasDataList = this._textureAtlasDataMap[name];
            if (disposeData) {
                for (const textureAtlasData of textureAtlasDataList) {
                    this._dragonBones.bufferObject(textureAtlasData);
                }
            }

            delete this._textureAtlasDataMap[name];
        }
    }
    /**
     * [en] Get a specific armature data.
     *
     * [zh] 获取特定的骨架数据。
     *
     * @param name - [en] The armature data name.
     * @param name - [zh] 骨架数据名称。
     *
     * @param dragonBonesName - [en] The cached name for DragonbonesData instance.
     * @param dragonBonesName - [zh] DragonBonesData 实例的缓存名称。
     *
     * @see ArmatureData
     * @version DragonBones 5.1
     */
    public getArmatureData(name: string, dragonBonesName: string = ""): ArmatureData | null {
        const dataPackage: BuildArmaturePackage = new BuildArmaturePackage();
        if (!this._fillBuildArmaturePackage(dataPackage, dragonBonesName, name, "", "")) {
            return null;
        }

        return dataPackage.armature;
    }
    /**
     * [en] Clear all cached DragonBonesData instances and TextureAtlasData instances.
     *
     * [zh] 清除缓存的所有 DragonBonesData 实例和 TextureAtlasData 实例。
     *
     * @param disposeData - [en] Whether to dispose data.
     * @param disposeData - [zh] 是否释放数据。
     *
     * @version DragonBones 4.5
     */
    public clear(disposeData: boolean = true): void {
        for (let k in this._dragonBonesDataMap) {
            if (disposeData) {
                this._dragonBones.bufferObject(this._dragonBonesDataMap[k]);
            }

            delete this._dragonBonesDataMap[k];
        }

        for (let k in this._textureAtlasDataMap) {
            if (disposeData) {
                const textureAtlasDataList = this._textureAtlasDataMap[k];
                for (const textureAtlasData of textureAtlasDataList) {
                    this._dragonBones.bufferObject(textureAtlasData);
                }
            }

            delete this._textureAtlasDataMap[k];
        }
    }
    /**
     * [en] Create a armature from cached DragonBonesData instances and TextureAtlasData instances.
     * Note that when the created armature that is no longer in use, you need to explicitly dispose {@link Armature#dispose()}.
     *
     * [zh] 通过缓存的 DragonBonesData 实例和 TextureAtlasData 实例创建一个骨架。
     * 注意，创建的骨架不再使用时，需要显式释放 {@link Armature#dispose()}。
     *
     * @param armatureName - [en] The armature data name.
     * @param armatureName - [zh] 骨架数据名称。
     *
     * @param dragonBonesName - [en] The cached name of the DragonBonesData instance. (If not set, all DragonBonesData instances are retrieved, and when multiple DragonBonesData instances contain a the same name armature data, it may not be possible to accurately create a specific armature)
     * @param dragonBonesName - [zh] DragonBonesData 实例的缓存名称。 （如果未设置，将检索所有的 DragonBonesData 实例，当多个 DragonBonesData 实例中包含同名的骨架数据时，可能无法准确的创建出特定的骨架）
     *
     * @param skinName - [en] The skin name, you can set a different ArmatureData name to share it's skin data. (If not set, use the default skin data)
     * @param skinName - [zh] 皮肤名称，可以设置一个其他骨架数据名称来共享其皮肤数据。（如果未设置，则使用默认的皮肤数据）
     *
     * @returns [en] The armature.
     * @returns [zh] 骨架。
     *
     * @example
     * ```ts
     *     let armature = factory.buildArmature("armatureName", "dragonBonesName");
     *     armature.clock = factory.clock;
     * ```
     * @see DragonBonesData
     * @see ArmatureData
     * @version DragonBones 3.0
     */
    public buildArmature(armatureName: string, dragonBonesName: string = "", skinName: string = "", textureAtlasName: string = ""): Armature | null {
        const dataPackage: BuildArmaturePackage = new BuildArmaturePackage();
        if (!this._fillBuildArmaturePackage(dataPackage, dragonBonesName || "", armatureName, skinName || "", textureAtlasName || "")) {
            console.warn("No armature data: " + armatureName + ", " + (dragonBonesName !== null ? dragonBonesName : ""));
            return null;
        }

        const armature = this._buildArmature(dataPackage);
        this._buildBones(dataPackage, armature);
        this._buildSlots(dataPackage, armature);
        this._buildConstraints(dataPackage, armature);
        armature.invalidUpdate(null, true);
        armature.advanceTime(0.0); // Update armature pose.

        return armature;
    }
    /**
     * @private
     */
    public replaceDisplay(slot: Slot, displayData: DisplayData | null, displayIndex: number = -1): void {
        if (displayIndex < 0) {
            displayIndex = slot.displayIndex;
        }

        if (displayIndex < 0) {
            displayIndex = 0;
        }

        slot.replaceDisplayData(displayData, displayIndex);

        if (displayData !== null) {
            let display = this._getSlotDisplay(null, displayData, slot);
            if (displayData.type === DisplayType.Image) {
                const rawDisplayData = slot.getDisplayFrameAt(displayIndex).rawDisplayData;
                if (
                    rawDisplayData !== null &&
                    rawDisplayData.type === DisplayType.Mesh
                ) {
                    display = slot.meshDisplay;
                }
            }

            slot.replaceDisplay(display, displayIndex);
        }
        else {
            slot.replaceDisplay(null, displayIndex);
        }
    }
    /**
     * [en] Replaces the current display data for a particular slot with a specific display data.
     * Specify display data with "dragonBonesName/armatureName/slotName/displayName".
     *
     * [zh] 用特定的显示对象数据替换特定插槽当前的显示对象数据。
     * 用 "dragonBonesName/armatureName/slotName/displayName" 指定显示对象数据。
     *
     * @param dragonBonesName - [en] The DragonBonesData instance cache name.
     * @param dragonBonesName - [zh] DragonBonesData 实例的缓存名称。
     *
     * @param armatureName - [en] The armature data name.
     * @param armatureName - [zh] 骨架数据名称。
     *
     * @param slotName - [en] The slot data name.
     * @param slotName - [zh] 插槽数据名称。
     *
     * @param displayName - [en] The display data name.
     * @param displayName - [zh] 显示对象数据名称。
     *
     * @param slot - [en] The slot.
     * @param slot - [zh] 插槽。
     *
     * @param displayIndex - [en] The index of the display data that is replaced. (If it is not set, replaces the current display data)
     * @param displayIndex - [zh] 被替换的显示对象数据的索引。 （如果未设置，则替换当前的显示对象数据）
     *
     * @example
     * ```ts
     *     let slot = armature.getSlot("weapon");
     *     factory.replaceSlotDisplay("dragonBonesName", "armatureName", "slotName", "displayName", slot);
     * ```
     * @version DragonBones 4.5
     */
    public replaceSlotDisplay(
        dragonBonesName: string, armatureName: string, slotName: string, displayName: string,
        slot: Slot, displayIndex: number = -1
    ): boolean {
        const armatureData = this.getArmatureData(armatureName, dragonBonesName || "");
        if (armatureData === null || armatureData.defaultSkin === null) {
            return false;
        }

        const displayData = armatureData.defaultSkin.getDisplay(slotName, displayName);
        this.replaceDisplay(slot, displayData, displayIndex);

        return true;
    }
    /**
     * @private
     */
    public replaceSlotDisplayList(
        dragonBonesName: string | null, armatureName: string, slotName: string,
        slot: Slot
    ): boolean {
        const armatureData = this.getArmatureData(armatureName, dragonBonesName || "");
        if (!armatureData || !armatureData.defaultSkin) {
            return false;
        }

        const displayDatas = armatureData.defaultSkin.getDisplays(slotName);
        if (!displayDatas) {
            return false;
        }

        slot.displayFrameCount = displayDatas.length;
        for (let i = 0, l = slot.displayFrameCount; i < l; ++i) {
            const displayData = displayDatas[i];
            this.replaceDisplay(slot, displayData, i);
        }

        return true;
    }
    /**
     * [en] Share specific skin data with specific armature.
     *
     * [zh] 将特定的皮肤数据共享给特定的骨架使用。
     *
     * @param armature - [en] The armature.
     * @param armature - [zh] 骨架。
     *
     * @param skin - [en] The skin data.
     * @param skin - [zh] 皮肤数据。
     *
     * @param isOverride - [en] Whether it completely override the original skin. (Default: false)
     * @param isOverride - [zh] 是否完全覆盖原来的皮肤。 （默认: false）
     *
     * @param exclude - [en] A list of slot names that do not need to be replace.
     * @param exclude - [zh] 不需要被替换的插槽名称列表。
     *
     * @example
     * ```ts
     *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
     *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
     *     if (armatureDataB && armatureDataB.defaultSkin) {
     *     factory.replaceSkin(armatureA, armatureDataB.defaultSkin, false, ["arm_l", "weapon_l"]);
     *     }
     * ```
     * @see Armature
     * @see SkinData
     * @version DragonBones 5.6
     */
    public replaceSkin(armature: Armature, skin: SkinData, isOverride: boolean = false, exclude: Array<string> | null = null): boolean {
        let success = false;
        const defaultSkin = skin.parent.defaultSkin;

        for (const slot of armature.getSlots()) {
            if (exclude !== null && exclude.indexOf(slot.name) >= 0) {
                continue;
            }

            let displayDatas = skin.getDisplays(slot.name);
            if (displayDatas === null) {
                if (defaultSkin !== null && skin !== defaultSkin) {
                    displayDatas = defaultSkin.getDisplays(slot.name);
                }

                if (displayDatas === null) {
                    if (isOverride) {
                        slot.displayFrameCount = 0;
                    }
                    continue;
                }
            }

            slot.displayFrameCount = displayDatas.length;
            for (let i = 0, l = slot.displayFrameCount; i < l; ++i) {
                const displayData = displayDatas[i];
                slot.replaceRawDisplayData(displayData, i);

                if (displayData !== null) {
                    slot.replaceDisplay(this._getSlotDisplay(null, displayData, slot), i);
                }
                else {
                    slot.replaceDisplay(null, i);
                }
            }

            success = true;
        }

        return success;
    }
    /**
     * [en] Replaces the existing animation data for a specific armature with the animation data for the specific armature data.
     * This enables you to make a armature template so that other armature without animations can share it's animations.
     *
     * [zh] 用特定骨架数据的动画数据替换特定骨架现有的动画数据。
     * 这样就能实现制作一个骨架动画模板，让其他没有制作动画的骨架共享该动画。
     *
     * @param armature - [en] The armtaure.
     * @param armature - [zh] 骨架。
     *
     * @param armatureData - [en] The armature data.
     * @param armatureData - [zh] 骨架数据。
     *
     * @param isOverride - [en] Whether to completely overwrite the original animation. (Default: false)
     * @param isOverride - [zh] 是否完全覆盖原来的动画。（默认: false）
     *
     * @example
     * ```ts
     *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
     *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
     *     if (armatureDataB) {
     *     factory.replaceAnimation(armatureA, armatureDataB);
     *     }
     * ```
     * @see Armature
     * @see ArmatureData
     * @version DragonBones 5.6
     */
    public replaceAnimation(armature: Armature, armatureData: ArmatureData, isOverride: boolean = true): boolean {
        const skinData = armatureData.defaultSkin;
        if (skinData === null) {
            return false;
        }

        if (isOverride) {
            armature.animation.animations = armatureData.animations;
        }
        else {
            const rawAnimations = armature.animation.animations;
            const animations: Record<string, AnimationData> = {};

            for (let k in rawAnimations) {
                animations[k] = rawAnimations[k];
            }

            for (let k in armatureData.animations) {
                animations[k] = armatureData.animations[k];
            }

            armature.animation.animations = animations;
        }

        for (const slot of armature.getSlots()) {
            let index = 0;
            for (const display of slot.displayList) {
                if (display instanceof Armature) {
                    const displayDatas = skinData.getDisplays(slot.name);
                    if (displayDatas !== null && index < displayDatas.length) {
                        const displayData = displayDatas[index];
                        if (displayData !== null && displayData.type === DisplayType.Armature) {
                            const childArmatureData = this.getArmatureData(displayData.path, displayData.parent.parent.parent.name);
                            if (childArmatureData) {
                                this.replaceAnimation(display, childArmatureData, isOverride);
                            }
                        }
                    }
                }

                index++;
            }
        }

        return true;
    }
    /**
     * @private
     */
    public getAllDragonBonesData(): Record<string, DragonBonesData> {
        return this._dragonBonesDataMap;
    }
    /**
     * @private
     */
    public getAllTextureAtlasData(): Record<string, Array<TextureAtlasData>> {
        return this._textureAtlasDataMap;
    }
    /**
     * [en] An Worldclock instance updated by engine.
     *
     * [zh] 由引擎驱动的 WorldClock 实例。
     *
     * @version DragonBones 5.7
     */
    public get clock(): WorldClock {
        return this._dragonBones.clock;
    }
    /**
     * @private
     */
    public get dragonBones(): DragonBones {
        return this._dragonBones;
    }
}
/**
 * @private
 */
export class BuildArmaturePackage {
    public dataName: string = "";
    public textureAtlasName: string = "";
    public data: DragonBonesData;
    public armature: ArmatureData;
    public skin: SkinData | null = null;
}
