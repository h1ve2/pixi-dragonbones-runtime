# pixi-dragonbones-runtime
<p style="text-align:center;" align="center">
    <picture align="center">
        <img align="center" alt="pixi-dragonbones-runtime" width="200" src="https://h1ve2.github.io/pixi-dragonbones-runtime/images/pic.png" />
    </picture>
    <div align="center" style="margin-top: -20px">
        <h3>DragonBones Runtime for Pixi.js</h3>
        <p>supports Pixi.js@7~8.x</p>
    </div>
</p>

[简体中文](./README.zh-CN.md)

- [Guide](https://h1ve2.github.io/pixi-dragonbones-runtime/guide/)
- [API](https://h1ve2.github.io/pixi-dragonbones-runtime/api/8.x/)

## Install
```sh [npm]
$ npm i pixi-dragonbones-runtime
```
or
```sh [yarn]
$ yarn add pixi-dragonbones-runtime
```
> [!WARNING]
> When using `pixi.js@7.x` install `pixi-dragonbones-runtime@7.x`.

## Usage
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
## Example
[![example](https://github.com/h1ve2/pixi-dragonbones-runtime-starter/raw/main/preview.gif)](https://h1ve2.github.io/pixi-dragonbones-runtime/guide/#Example)

- [Online Example](https://h1ve2.github.io/pixi-dragonbones-runtime/guide/#Example)
- [Starter Project](https://github.com/h1ve2/pixi-dragonbones-runtime-starter) (pixi & vite & assetpack)
