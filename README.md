# DragonBones Runtime for Pixi.js

适用于Pixi.js的DragonBones运行时

supports [Pixi.js](https://pixijs.com/)@7~8.x

## 安装
```sh [npm]
$ npm install pixi-dragonbones-runtime
```
or
```sh [yarn]
$ yarn add pixi-dragonbones-runtime
```
> [!WARNING]
> **pixi.js@7.x** 对应 **pixi-dragonbones-runtime@7.x** 版本。

## 使用
```ts
import { PixiFactory } from "pixi-dragonbones-runtime";

// after assets loaded
const factory = PixiFactory.factory;
factory.parseDragonBonesData("xxx_ske.json"); // asset alias or JSON Object 
factory.parseTextureAtlasData("xxx_tex.json", "xxx_tex.png");

const armatureDisplay = factory.buildArmatureDisplay("xxx");

armatureDisplay.animation.play("xxx",-1);


this.addChild(armatureDisplay);

```