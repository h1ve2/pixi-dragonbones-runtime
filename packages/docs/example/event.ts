import {Application, Assets} from 'pixi.js';
import {EventObject, PixiFactory} from "pixi-dragonbones-runtime";
import "./styles.css";

(async () => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({
        background: '#eee',
        antialias: true,
        resizeTo: window
    });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    await Assets.init({
        basePath: 'https://h1ve2.github.io/pixi-dragonbones-runtime/assets/'
    });

    // Add the assets to load
    Assets.add({alias: 'pixilogo_ske.json', src: 'pixilogo_ske.json'});
    Assets.add({alias: 'pixilogo_tex.json', src: 'pixilogo_tex.json'});
    Assets.add({alias: 'pixilogo_tex.png', src: 'pixilogo_tex.png'});

    await Assets.load(['pixilogo_ske.json', 'pixilogo_tex.json', 'pixilogo_tex.png'])

    const factory = PixiFactory.factory;

    // asset alias or JSON Object
    factory.parseDragonBonesData("pixilogo_ske.json");
    factory.parseTextureAtlasData("pixilogo_tex.json",
        "pixilogo_tex.png");

    const armatureDisplay = factory.buildArmatureDisplay("pixilogo");

    armatureDisplay.position.set(app.screen.width / 2, app.screen.height / 2);

    // add to stage
    app.stage.addChild(armatureDisplay);

    // add event listener
    armatureDisplay.addEventListener(EventObject.START, () => console.log('START'));
    armatureDisplay.addEventListener(EventObject.LOOP_COMPLETE, () => console.log('LOOP_COMPLETE'));
    armatureDisplay.addDBEventListener(EventObject.FRAME_EVENT, (e: EventObject) =>
        console.log(`FRAME_EVENT : ${e.name}`), armatureDisplay);
    armatureDisplay.addEventListener(EventObject.COMPLETE, () => console.log('COMPLETE'));

    // play animation
    armatureDisplay.animation.play("Scaling", 3);


})();