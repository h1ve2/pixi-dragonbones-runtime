# pixi-dragonbones-runtime
<p style="text-align:center;" align="center">
    <picture align="center">
        <img align="center" alt="pixi-dragonbones-runtime" width="200" src="https://h1ve2.github.io/pixi-dragonbones-runtime/images/pic.png" />
    </picture>
    <div align="center" style="margin-top: -20px">
        <h3>DragonBones Runtime for Pixi.js</h3>
    </div>
</p>

supports [Pixi.js](https://pixijs.com/)@7~8.x

- [指南](https://h1ve2.github.io/pixi-dragonbones-runtime/guide/)
- [API文档](https://h1ve2.github.io/pixi-dragonbones-runtime/api/8.x/)

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

app.stage.addChild(armatureDisplay);

```
## 示例
![demo](https://github.com/h1ve2/pixi-dragonbones-runtime-starter/raw/main/preview.gif)

- [完整示例](https://h1ve2.github.io/pixi-dragonbones-runtime/guide/#demo)
- [starter示例项目](https://github.com/h1ve2/pixi-dragonbones-runtime-starter) (pixi & vite & assetpack)
