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

import { AnimationState } from "../animation/index.js";
import { Armature, Bone, Slot } from "../armature/index.js";
import { BaseObject, ActionType } from "../core/index.js";
import { ActionData, UserData } from "../model/index.js";
import { EventStringType } from "./IEventDispatcher.js";

/**
 * [en] The properties of the object carry basic information about an event,
 * which are passed as parameter or parameter's parameter to event listeners when an event occurs.
 *
 * [zh] 事件对象，包含有关事件的基本信息，当发生事件时，该实例将作为参数或参数的参数传递给事件侦听器。
 *
 * @version DragonBones 4.5
 */
export class EventObject extends BaseObject {
    /**
     * [en] Animation start play.
     *
     * [zh] 动画开始播放。
     *
     * @version DragonBones 4.5
     */
    public static readonly START = "start";
    /**
     * [en] Animation loop play complete once.
     *
     * [zh] 动画循环播放完成一次。
     *
     * @version DragonBones 4.5
     */
    public static readonly LOOP_COMPLETE = "loopComplete";
    /**
     * [en] Animation play complete.
     *
     * [zh] 动画播放完成。
     *
     * @version DragonBones 4.5
     */
    public static readonly COMPLETE = "complete";
    /**
     * [en] Animation fade in start.
     *
     * [zh] 动画淡入开始。
     *
     * @version DragonBones 4.5
     */
    public static readonly FADE_IN = "fadeIn";
    /**
     * [en] Animation fade in complete.
     *
     * [zh] 动画淡入完成。
     *
     * @version DragonBones 4.5
     */
    public static readonly FADE_IN_COMPLETE = "fadeInComplete";
    /**
     * [en] Animation fade out start.
     *
     * [zh] 动画淡出开始。
     *
     * @version DragonBones 4.5
     */
    public static readonly FADE_OUT = "fadeOut";
    /**
     * [en] Animation fade out complete.
     *
     * [zh] 动画淡出完成。
     *
     * @version DragonBones 4.5
     */
    public static readonly FADE_OUT_COMPLETE = "fadeOutComplete";
    /**
     * [en] Animation frame event.
     *
     * [zh] 动画帧事件。
     *
     * @version DragonBones 4.5
     */
    public static readonly FRAME_EVENT = "frameEvent";
    /**
     * [en] Animation frame sound event.
     *
     * [zh] 动画帧声音事件。
     *
     * @version DragonBones 4.5
     */
    public static readonly SOUND_EVENT = "soundEvent";
    /**
     * @internal
     * @private
     */
    public static actionDataToInstance(data: ActionData, instance: EventObject, armature: Armature): void {
        if (data.type === ActionType.Play) {
            instance.type = EventObject.FRAME_EVENT;
        }
        else {
            instance.type = data.type === ActionType.Frame ? EventObject.FRAME_EVENT : EventObject.SOUND_EVENT;
        }

        instance.name = data.name;
        instance.armature = armature;
        instance.actionData = data;
        instance.data = data.data;

        if (data.bone !== null) {
            instance.bone = armature.getBone(data.bone.name);
        }

        if (data.slot !== null) {
            instance.slot = armature.getSlot(data.slot.name);
        }
    }

    public static toString(): string {
        return "[class dragonBones.EventObject]";
    }
    /**
     * [en] If is a frame event, the value is used to describe the time that the event was in the animation timeline. (In seconds)
     *
     * [zh] 如果是帧事件，此值用来描述该事件在动画时间轴中所处的时间。（以秒为单位）
     *
     * @version DragonBones 4.5
     */
    public time: number;
    /**
     * [en] The event type。
     *
     * [zh] 事件类型。
     *
     * @version DragonBones 4.5
     */
    public type: EventStringType;
    /**
     * [en] The event name. (The frame event name or the frame sound name)
     *
     * [zh] 事件名称。 (帧事件的名称或帧声音的名称)
     *
     * @version DragonBones 4.5
     */
    public name: string;
    /**
     * [en] The armature that dispatch the event.
     *
     * [zh] 发出该事件的骨架。
     *
     * @see Armature
     * @version DragonBones 4.5
     */
    public armature: Armature;
    /**
     * [en] The bone that dispatch the event.
     *
     * [zh] 发出该事件的骨骼。
     *
     * @see Bone
     * @version DragonBones 4.5
     */
    public bone: Bone | null;
    /**
     * [en] The slot that dispatch the event.
     *
     * [zh] 发出该事件的插槽。
     *
     * @see Slot
     * @version DragonBones 4.5
     */
    public slot: Slot | null;
    /**
     * [en] The animation state that dispatch the event.
     *
     * [zh] 发出该事件的动画状态。
     *
     * @see AnimationState
     * @version DragonBones 4.5
     */
    public animationState: AnimationState;
    /**
     * @private
     */
    public actionData: ActionData | null;
    /**
     * @private
     */
    /**
     * [en] The custom data.
     *
     * [zh] 自定义数据。
     *
     * @see CustomData
     * @version DragonBones 5.0
     */
    public data: UserData | null;

    protected _onClear(): void {
        this.time = 0.0;
        this.type = "" as EventStringType;
        this.name = "";
        this.armature = null as any;
        this.bone = null;
        this.slot = null;
        this.animationState = null as any;
        this.actionData = null;
        this.data = null;
    }
}
