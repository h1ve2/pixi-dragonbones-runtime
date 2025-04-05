---
outline: deep
---
# 快速开始

## 安装
::: code-group
```sh [npm]
$ npm install pixi-dragonbones-runtime
```
```sh [yarn]
$ yarn add pixi-dragonbones-runtime
```
:::
> [!WARNING]
> **pixi.js@7.x** 对应 **pixi-dragonbones-runtime@7.x** 版本。
## 使用
```ts
import { PixiFactory } from "pixi-dragonbones-runtime";

// 资源加载后创建
const factory = PixiFactory.factory;
factory.parseDragonBonesData("xxx_ske.json"); // asset别名或JSON对象
factory.parseTextureAtlasData("xxx_tex.json", "xxx_tex.png");

const armatureDisplay = factory.buildArmatureDisplay("xxx");

armatureDisplay.animation.play("xxx",-1);


this.addChild(armatureDisplay);
```
## 示例
> 完善中...