# Event
The event system is a very important functional module. It can help you listen to the playback status of animations, trigger specific logic, or implement interactive effects.
## Usage
```ts
// after buildArmatureDisplay
armatureDisplay.addEventListener(EventObject.START, onStart);
armatureDisplay.addEventListener(EventObject.COMPLETE, onComplete);

// play animation
armatureDisplay.animation.play("yourAnimationName");

// event callback
function onStart(event) {
    console.log("on start");
}

function onComplete(event) {
    console.log("on complete");
}
```

## Frame Event
Frame events are a very useful feature in DragonBones, allowing you to set custom event data on keyframes of an animation. When the animation plays to these keyframes, the FRAME_EVENT will be triggered.
```ts
function onFrameEvent(event) {
    let eventData = event.eventObject;
    console.log(`frameEvent name: ${eventData.name}, data: ${eventData.data}`);
    
    // 根据事件名称执行不同逻辑
    if (eventData.name === "attack") {
        console.log("attack!");
    } else if (eventData.name === "jump") {
        console.log("jump!");
    }
}
```
## Event Type
- START 动画开始播放时触发。
- LOOP_COMPLETE 动画完成一次循环时触发（如果动画设置了循环次数）。
- COMPLETE 动画完全结束时触发。
- FADE_IN 动画淡入开始时触发。
- FADE_IN_COMPLETE 动画淡入完成时触发。
- FADE_OUT 动画淡出开始时触发。
- FADE_OUT_COMPLETE 动画淡出完成时触发。
- FRAME_EVENT 动画中的关键帧触发自定义事件时触发。

> For more information, please refer to [API](../api/8.x/classes/EventObject.md)

## Example
<!--@include: ../example/event.md-->