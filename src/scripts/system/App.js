import * as PIXI from "pixi.js";
import {Loader} from './Loader';
import {ScenesManager} from './ScenesManager';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

class Application {
    run( config) {

        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.config = config;

        this.app = new PIXI.Application({resizeTo: window});
        document.body.appendChild(this.app.view);

        this.scenes = new ScenesManager();
        this.app.stage.interactive = true;
        this.app.stage.addChild(this.scenes.container);

        this.loader = new Loader(this.app.loader, this.config);
        this.loader.preload().then(() => {
            this.start();
        });
    }
    start() {
        this.scenes.start('Game');
    }

    res(key) {
        return this.loader.resources[key].texture;
    }

    sprite(key) {
        return new PIXI.Sprite(this.res(key));
    }


}
export const App = new Application();
