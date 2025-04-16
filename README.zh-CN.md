# pixi-dragonbones-runtime
<p style="text-align:center;" align="center">
    <picture align="center">
        <img align="center" alt="pixi-dragonbones-runtime" width="200" src="https://h1ve2.github.io/pixi-dragonbones-runtime/images/pic.png" />
    </picture>
    <div align="center" style="margin-top: -20px">
        <h3>DragonBones Runtime for Pixi.js</h3>
        <p>支持 Pixi.js@7~8.x</p>
    </div>
</p>

[English](./README.md)

- [指南](https://h1ve2.github.io/pixi-dragonbones-runtime/guide/)
- [API文档](https://h1ve2.github.io/pixi-dragonbones-runtime/api/8.x/)

## 安装
```sh [npm]
$ npm i pixi-dragonbones-runtime
```
or
```sh [yarn]
$ yarn add pixi-dragonbones-runtime
```
> [!WARNING]
> `pixi.js@7.x`对应`pixi-dragonbones-runtime@7.x`版本.

## 使用
```ts
import { PixiFactory } from "pixi-dragonbones-runtime";

// 资源加载后
const factory = PixiFactory.factory;

// 资源别名或对象
factory.parseDragonBonesData("xxx_ske.json"); 
factory.parseTextureAtlasData("xxx_tex.json", "xxx_tex.png");

const armatureDisplay = factory.buildArmatureDisplay("xxx");

armatureDisplay.animation.play("xxx",-1);

app.stage.addChild(armatureDisplay);

```
## 示例
[![example](https://github.com/h1ve2/pixi-dragonbones-runtime-starter/raw/main/preview.gif)](https://h1ve2.github.io/pixi-dragonbones-runtime/guide/#Example)

- [完整示例](https://h1ve2.github.io/pixi-dragonbones-runtime/guide/#Example)
- [starter示例项目](https://github.com/h1ve2/pixi-dragonbones-runtime-starter) (pixi & vite & assetpack)
