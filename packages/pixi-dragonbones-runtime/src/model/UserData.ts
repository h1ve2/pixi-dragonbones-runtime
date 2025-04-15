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

import { BaseObject, ActionType } from "../core/index.js";
import { BoneData, SlotData } from "./ArmatureData.js";

/**
 * [en] The user custom data.
 *
 * [zh] 用户自定义数据。
 *
 * @version DragonBones 5.0
 */
export class UserData extends BaseObject {
    public static toString(): string {
        return "[class dragonBones.UserData]";
    }
    /**
     * [en] The custom int numbers.
     *
     * [zh] 自定义整数。
     *
     * @version DragonBones 5.0
     */
    public readonly ints: Array<number> = [];
    /**
     * [en] The custom float numbers.
     *
     * [zh] 自定义浮点数。
     *
     * @version DragonBones 5.0
     */
    public readonly floats: Array<number> = [];
    /**
     * [en] The custom strings.
     *
     * [zh] 自定义字符串。
     *
     * @version DragonBones 5.0
     */
    public readonly strings: Array<string> = [];

    protected _onClear(): void {
        this.ints.length = 0;
        this.floats.length = 0;
        this.strings.length = 0;
    }
    /**
     * @internal
     */
    public addInt(value: number): void {
        this.ints.push(value);
    }
    /**
     * @internal
     */
    public addFloat(value: number): void {
        this.floats.push(value);
    }
    /**
     * @internal
     */
    public addString(value: string): void {
        this.strings.push(value);
    }
    /**
     * [en] Get the custom int number.
     *
     * [zh] 获取自定义整数。
     *
     * @version DragonBones 5.0
     */
    public getInt(index: number = 0): number {
        return index >= 0 && index < this.ints.length ? this.ints[index] : 0;
    }
    /**
     * [en] Get the custom float number.
     *
     * [zh] 获取自定义浮点数。
     *
     * @version DragonBones 5.0
     */
    public getFloat(index: number = 0): number {
        return index >= 0 && index < this.floats.length ? this.floats[index] : 0.0;
    }
    /**
     * [en] Get the custom string.
     *
     * [zh] 获取自定义字符串。
     *
     * @version DragonBones 5.0
     */
    public getString(index: number = 0): string {
        return index >= 0 && index < this.strings.length ? this.strings[index] : "";
    }
}
/**
 * @private
 */
export class ActionData extends BaseObject {
    public static toString(): string {
        return "[class dragonBones.ActionData]";
    }

    public type: ActionType;
    public name: string; // Frame event name | Sound event name | Animation name
    public bone: BoneData | null;
    public slot: SlotData | null;
    public data: UserData | null = null; //

    protected _onClear(): void {
        if (this.data !== null) {
            this.data.returnToPool();
        }

        this.type = ActionType.Play;
        this.name = "";
        this.bone = null;
        this.slot = null;
        this.data = null;
    }
}
