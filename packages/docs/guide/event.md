# 事件

## 监听事件
```
const armatureDisplay = factory.buildArmatureDisplay("test");

armatureDisplay.on(EventObject.LOOP_COMPLETE, (e: EventObject) => {
    console.log(e);
});
```

## 支持的事件
- START 动画开始播放
- LOOP_COMPLETE 动画循环播放完成一次
- COMPLETE 动画播放完成
- FADE_IN 动画淡入开始
- FADE_IN_COMPLETE 动画淡入完成
- FADE_OUT 动画淡出开始
- FADE_OUT_COMPLETE 动画淡出完成
- FRAME_EVENT 动画帧事件
- SOUND_EVENT 动画帧声音事件