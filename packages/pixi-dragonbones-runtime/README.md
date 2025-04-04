# DragonBones Runtime for Pixi.js

supports @7.x

## install
```sh [npm]
$ npm install pixi-dragonbones-runtime@7.x
```
or
```sh [yarn]
$ yarn add pixi-dragonbones-runtime@7.x
```
## usage
```
import { PixiFactory } from "pixi-dragonbones-runtime";
...

// after assets loaded
const factory = PixiFactory.factory;
factory.parseDragonBonesData("xxx_ske.json"); // asset alias or JSON Object 
factory.parseTextureAtlasData("xxx_tex.json", "xxx_tex.png");

const armatureDisplay = factory.buildArmatureDisplay("xxx");

armatureDisplay.animation.play("xxx",-1);


this.addChild(armatureDisplay);
...
```