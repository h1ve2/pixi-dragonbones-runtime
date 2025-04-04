---
outline: deep
---
# pixi-dragonbones-runtime

适用于Pixi.js的DragonBones运行时

支持Pixi.js@8.x

## 安装
::: code-group

```sh [npm]
$ npm install pixi-dragonbones-runtime
```
```sh [yarn]
$ yarn add pixi-dragonbones-runtime
```
:::
## 使用
```
import { PixiFactory } from "pixi-dragonbones-runtime";
...

// 资源加载后创建
const factory = PixiFactory.factory;
factory.parseDragonBonesData("xxx_ske.json"); // asset别名或JSON对象
factory.parseTextureAtlasData("xxx_tex.json", "xxx_tex.png");

const armatureDisplay = factory.buildArmatureDisplay("xxx");

armatureDisplay.animation.play("xxx",-1);


this.addChild(armatureDisplay);
...
```
