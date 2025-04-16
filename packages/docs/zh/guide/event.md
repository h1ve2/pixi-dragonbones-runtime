# 事件
事件系统是一个非常重要的功能模块。它可以帮助你监听动画的播放状态、触发特定逻辑或实现交互效果。
## 基本用法
```ts
// buildArmatureDisplay 动画数据后
// 添加事件监听器
armatureDisplay.addEventListener(EventObject.START, onStart);
armatureDisplay.addEventListener(EventObject.COMPLETE, onComplete);

// 播放动画
armatureDisplay.animation.play("yourAnimationName");

// 定义事件回调函数
function onStart(event) {
    console.log("动画开始播放");
}

function onComplete(event) {
    console.log("动画播放完成");
}
```

## 帧事件
帧事件是 DragonBones 中非常有用的功能，允许你在动画的关键帧上设置自定义事件数据。当动画播放到这些关键帧时，会触发 FRAME_EVENT 事件。
```ts
function onFrameEvent(event) {
    let eventData = event.eventObject;
    console.log(`帧事件名称: ${eventData.name}, 数据: ${eventData.data}`);
    
    // 根据事件名称执行不同逻辑
    if (eventData.name === "attack") {
        console.log("角色发动攻击！");
    } else if (eventData.name === "jump") {
        console.log("角色跳跃！");
    }
}
```
## 事件类型
- START 动画开始播放时触发。
- LOOP_COMPLETE 动画完成一次循环时触发（如果动画设置了循环次数）。
- COMPLETE 动画完全结束时触发。
- FADE_IN 动画淡入开始时触发。
- FADE_IN_COMPLETE 动画淡入完成时触发。
- FADE_OUT 动画淡出开始时触发。
- FADE_OUT_COMPLETE 动画淡出完成时触发。
- FRAME_EVENT 动画中的关键帧触发自定义事件时触发。

> 更多内容请参考[API](../api/8.x/classes/EventObject.md)

## 示例
<!--@include: ../../example/event.md-->