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

import { IAnimatable } from "./IAnimatable.js";

/**
 * [en] Worldclock provides clock support for animations, advance time for each IAnimatable object added to the instance.
 *
 * [zh] WorldClock 对动画提供时钟支持，为每个加入到该实例的 IAnimatable 对象更新时间。
 *
 * @see IAnimateble
 * @see Armature
 * @version DragonBones 3.0
 */
export class WorldClock {
    /**
     * [en] Current time. (In seconds)
     *
     * [zh] 当前的时间。 (以秒为单位)
     *
     * @version DragonBones 3.0
     */
    public time: number = 0.0;
    /**
     * [en] The play speed, used to control animation speed-shift play.
     * [0: Stop play, (0~1): Slow play, 1: Normal play, (1~N): Fast play]
     *
     * [zh] 播放速度，用于控制动画变速播放。
     * [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
     *
     * @default 1.0
     * @version DragonBones 3.0
     */
    public timeScale: number = 1.0;

    private readonly _animatebles: Array<IAnimatable | null> = [];
    /**
     * [en] Creating a Worldclock instance. Typically, you do not need to create Worldclock instance.
     * When multiple Worldclock instances are running at different speeds, can achieving some specific animation effects, such as bullet time.
     *
     * [zh] 创建一个 WorldClock 实例。通常并不需要创建 WorldClock 实例。
     * 当多个 WorldClock 实例使用不同的速度运行时，可以实现一些特殊的动画效果，比如子弹时间等。
     *
     * @version DragonBones 3.0
     */
    public constructor(time: number = 0.0) {
        this.time = time;
    }
    /**
     * [en] Advance time for all IAnimatable instances.
     *
     * [zh] 为所有的 IAnimatable 实例更新时间。
     *
     * @param passedTime - [en] Passed time. [-1: Automatically calculates the time difference between the current frame and the previous frame, [0~N): Passed time] (In seconds)
     * @param passedTime - [zh] 前进的时间。 [-1: 自动计算当前帧与上一帧的时间差, [0~N): 前进的时间] (以秒为单位)
     *
     * @version DragonBones 3.0
     */
    public advanceTime(passedTime: number): void {
        if (passedTime === 0.0) {
            return;
        }

        passedTime *= this.timeScale;
        this.time += passedTime;
        const animatebles = this._animatebles;

        let i = 0, r = 0, l = animatebles.length;
        for (; i < l; ++i) {
            const animatable = animatebles[i];
            if (animatable !== null) {
                if (r > 0) {
                    animatebles[i - r] = animatable;
                    animatebles[i] = null;
                }
                if (!animatable.stopped) {
                    animatable.advanceTime(passedTime);
                }
            }
            else {
                r++;
            }
        }

        if (r > 0) {
            l = animatebles.length;
            for (; i < l; ++i) {
                const animateble = animatebles[i];
                if (animateble !== null) {
                    animatebles[i - r] = animateble;
                }
                else {
                    r++;
                }
            }

            if (r < 8) {
                // pop is faster when removing only a few elements
                for (let i = 0; i < r; i += 1) {
                    animatebles.pop();
                }
            } else {
                animatebles.splice(-r);
            }
        }
    }
    /**
     * [en] Check whether contains a specific instance of IAnimatable.
     *
     * [zh] 检查是否包含特定的 IAnimatable 实例。
     *
     * @param value - [en] The IAnimatable instance.
     * @param value - [zh] IAnimatable 实例。
     *
     * @version DragonBones 3.0
     */
    public contains(value: IAnimatable): boolean {
        return this._animatebles.indexOf(value) >= 0
    }
    /**
     * [en] Add IAnimatable instance.
     *
     * [zh] 添加 IAnimatable 实例。
     *
     * @param value - [en] The IAnimatable instance.
     * @param value - [zh] IAnimatable 实例。
     *
     * @version DragonBones 3.0
     */
    public add(value: IAnimatable): void {
        if (this._animatebles.indexOf(value) < 0) {
            this._animatebles.push(value);
            value.clock = this;
        }
    }
    /**
     * [en] Removes a specified IAnimatable instance.
     *
     * [zh] 移除特定的 IAnimatable 实例。
     *
     * @param value - [en] The IAnimatable instance.
     * @param value - [zh] IAnimatable 实例。
     *
     * @version DragonBones 3.0
     */
    public remove(value: IAnimatable): void {
        const index = this._animatebles.indexOf(value);
        if (index >= 0) {
            this._animatebles[index] = null;
            value.clock = null;
        }
    }
    /**
     * [en] Clear all IAnimatable instances.
     *
     * [zh] 清除所有的 IAnimatable 实例。
     *
     * @version DragonBones 3.0
     */
    public clear(): void {
        for (const animatable of this._animatebles) {
            if (animatable !== null) {
                animatable.clock = null;
            }
        }
    }
}
