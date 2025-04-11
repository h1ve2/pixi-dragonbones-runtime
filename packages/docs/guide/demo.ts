import {Application, Assets} from 'pixi.js';
import {PixiFactory} from "pixi-dragonbones-runtime";
import "./styles.css";

(async () => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({
        background: '#eee',
        resizeTo: window
    });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    await Assets.init({
        basePath: 'https://h1ve2.github.io/pixi-dragonbones-runtime/assets/'
    });

    // Add the assets to load
    Assets.add({ alias: 'starter_ske.json', src: 'starter_ske.json' });
    Assets.add({ alias: 'starter_tex.json', src: 'starter_tex.json' });
    Assets.add({ alias: 'starter_tex.png', src: 'starter_tex.png' });

    await Assets.load(['starter_ske.json','starter_tex.json','starter_tex.png'])

    const factory = PixiFactory.factory;

    // asset alias or JSON Object
    factory.parseDragonBonesData("starter_ske.json");
    factory.parseTextureAtlasData("starter_tex.json",
        "starter_tex.png");

    const armatureDisplay = factory.buildArmatureDisplay("starter");

    armatureDisplay.position.set(app.screen.width/2+50, 450);

    app.stage.addChild(armatureDisplay);

    armatureDisplay.animation.play("throw", -1);

})();